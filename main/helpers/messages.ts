import { clients } from "../background";
import { websocketsToNick } from "../background";
let globalNumber: number = 0;

export interface ClientMessage {
  type:
    | "register"
    | "ping"
    | "dice"
    | "answer"
    | "pong"
    | "ACK"
    | "question"
    | "throwDice";
  destination: string;
}

export interface RegisterMessage extends ClientMessage {
  type: "register";
  nick: string;
}

export interface DiceThrowMessage extends ClientMessage {
  type: "dice";
  dice: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface AnswerMessage extends ClientMessage {
  type: "answer";
  answer: string;
}

export interface ACKMessage extends ClientMessage {
  type: "ACK";
  text: string;
}

export interface QuestionMessage extends ClientMessage {
  type: "question";
  content: string;
  answers: string[];
}

export const handleMessage = (msg: ClientMessage, ws: WebSocket) => {
  switch (msg.type) {
    case "ping":
      const from = websocketsToNick.get(ws);
      const to = clients.get(msg.destination);
      to?.send(JSON.stringify({ type: "ping", from: from }));
      break;

    case "register":
      const registerMsg = msg as RegisterMessage;
      handleRegister(registerMsg, ws);
      break;

    case "dice":
      // check zod
      const diceMsg: DiceThrowMessage = msg as DiceThrowMessage;
      handleDiceThrow(diceMsg, ws);
      break;

    case "answer":
      const answerMsg = msg as AnswerMessage;
      handleAnswer(answerMsg, ws);
      break;

    case "pong":
      const pongMsg = msg as ClientMessage;
      console.log(
        "Pong from App, message : received ping from " + pongMsg.destination
      );
      break;

    case "ACK":
      const ACKMessage = msg as ACKMessage;
      console.log("Received ACK from app, message : " + ACKMessage.text);
      break;

    case "question":
      const questionMessage = msg as QuestionMessage;
      sendQuestion(questionMessage);
      break;

    case "throwDice":
      throwDice(msg.destination);
      break;

    default:
      console.error("Unknown message type", JSON.stringify(msg));
  }
};

export const throwDice = (nick: string) => {
  const ws = clients.get(nick);
  ws?.send(JSON.stringify({ type: "throwDice" }));
};

const handleRegister = (msg: RegisterMessage, ws: WebSocket) => {
  if (msg.nick == "Gracz ") {
    msg.nick = msg.nick + globalNumber.toString(); // tymczasowo aby nazwy były różne i aby można było połaczyć różnych użytkowników
    globalNumber += 1;
  }

  clients.set(msg.nick, ws);
  websocketsToNick.set(ws, msg.nick);
  console.log("Registered", msg.nick, clients.size);
  ws?.send(JSON.stringify({ type: "registered" }));
};

const handleDiceThrow = (msg: DiceThrowMessage, ws: WebSocket) => {
  console.log("Dice throw", msg.dice);
  const from = websocketsToNick.get(ws);
  const to = clients.get(msg.destination);
  to?.send(JSON.stringify({ type: "dice", dice: msg.dice, from: from }));
};

const handleAnswer = (msg: AnswerMessage, ws: WebSocket) => {
  console.log("Answer", msg.answer);
  const from = websocketsToNick.get(ws);
  const to = clients.get(msg.destination);
  to?.send(JSON.stringify({ type: "answer", answer: msg.answer, from: from }));
};
const sendQuestion = (msg: QuestionMessage) => {
  const ws = clients.get(msg.destination);
  const message = JSON.stringify({
    type: "question",
    content: msg.content,
    answers: msg.answers,
  });

  ws?.send(message);
};
