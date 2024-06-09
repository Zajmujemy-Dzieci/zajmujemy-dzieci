import { ANSWER_TIMEOUT, THROW_DICE_TIMEOUT } from "../constants";
import { handleAnswer, handleDiceThrow } from "./messages";
import Client from "./client";

// Forming a main game loop
export enum GameState {
  Starting,
  Throw,
  Question,
  Answer,
  AwaitingEvent,
  End,
}

// First Law of Distributed Object Design: "don't distribute your objects"
class Game {
  clients = new Map<string, Client>();
  pawns = new Map<string, WebSocket>();
  order = new Array<string>();
  sessionId: string;
  timer: NodeJS.Timeout | null = null;
  state: GameState = GameState.Starting;

  constructor() {
    let date = new Date();
    this.sessionId = date.getTime().toString();
  }

  getActivePlayer() {
    return this.order[0];
  }

  start() {
    console.log("Game started");
    this.state = GameState.Throw;
  }

  isInProgress() {
    return (
      this.state === GameState.Throw ||
      this.state === GameState.Question ||
      this.state === GameState.Answer ||
      this.state === GameState.AwaitingEvent
    );
  }

  validateDiceThrow(by: string, value: number): boolean {
    console.log(`Dice thrown by ${by}, ${value}`);

    if (this.state !== GameState.Throw) {
      console.error("Not a time for throwing dice, current state is: " + this.state);
      return false;
    }

    if (by !== this.getActivePlayer()) {
      console.error("Not your turn", by, this.getActivePlayer());
      return false;
    }

    if (this.timer) clearTimeout(this.timer);

    this.state = GameState.AwaitingEvent;

    return true;
  }

  validateQuestion(to: string): WebSocket | null {
    console.log(`Question to ${to}`);

    if (this.state === GameState.AwaitingEvent)
      this.state = GameState.Question;
    if (this.state !== GameState.Question) {
      console.error("Not a time for asking questions");
      return null;
    }

    if (to !== this.getActivePlayer()) {
      console.error("Not your turn", to, this.getActivePlayer());
      return null;
    }

    const ws = this.clients.get(to)?.ws;

    if (!ws) {
      console.error("No such player");
      return null;
    }

    this.state = GameState.Answer;
    this.timer = setTimeout(() => {
      console.log("Timeout");
      handleAnswer({ type: "answer", answer: "Timeout", nick: to });
    }, ANSWER_TIMEOUT); // 30 seconds timeout

    return ws;
  }

  validateAnswer(from: string, answer: string): boolean {
    console.log(`Answer from ${from}, ${answer}`);

    if (this.state !== GameState.Answer) {
      console.error("Not a time for answering");
      return false;
    }

    if (from !== this.getActivePlayer()) {
      console.error("Not your turn", from, this.getActivePlayer());
      return false;
    }

    clearTimeout(this.timer!);
    this.state = GameState.AwaitingEvent;

    return true;
  }

  boardEventEnd() {
    console.log("Board event end");
    if (this.state !== GameState.AwaitingEvent)
      console.error("Not a time for closing the question");

    this.order = [...this.order.slice(1), this.order[0]];

    this.state = GameState.Throw;

    this.timer = setTimeout(() => {
      console.log("Timeout dice throw");
      handleDiceThrow({
        type: "dice",
        nick: this.getActivePlayer(),
        dice: 1,
      });
      this.clients
        .get(this.getActivePlayer())
        ?.send({ type: "timeout" });
    }, THROW_DICE_TIMEOUT);
  }
}

export default new Game();
