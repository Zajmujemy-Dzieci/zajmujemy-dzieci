import game from "./state";

export interface ClientMessage {
  type:
    | "register"
    | "ping"
    | "dice"
    | "answer"
    | "regPawn"
    | "movePawn"
    | "question"
    | "NICK"
    | "gameFinish"
    | "reset"
    | "remove"
    | "startGame";
}

export interface RegisterMessage extends ClientMessage {
  type: "register";
  nick: string;
}

export interface DiceThrowMessage extends ClientMessage {
  type: "dice";
  dice: 1 | 2 | 3 | 4 | 5 | 6;
  nick: string;
}

export interface AnswerMessage extends ClientMessage {
  type: "answer";
  answer: string;
  nick: string;
}

export interface ServerMessage {
  type: "pong" | "throwDice" | "registered";
}

export interface PawnRegisterMessage extends ClientMessage {
  type: "regPawn";
  nick: string;
}

export interface MovePawnMessage extends ClientMessage {
  type: "movePawn";
  fieldsToMove: number;
  nick: string;
  shouldMoveFlag: boolean;
}

export interface QuestionMessage extends ClientMessage {
  type: "question";
  nick: string;
  possibleAnswers: number;
}

export interface NickMessage extends ClientMessage {
  type: "NICK";
  nick: string;
}

export interface GameFinishMessage extends ClientMessage {
  type: "gameFinish";
}

export interface RemoveMessage extends ClientMessage {
  type: "remove";
  nick: string;
}


export type TurnMessage = {
  type: "yourTurn";
  nick: string;
};

export const handleMessage = (msg: ClientMessage, ws: WebSocket) => {
  switch (msg.type) {
    case "ping":
      handlePing(ws);
      break;

    case "register":
      const registerMsg = msg as RegisterMessage;
      handleRegister(registerMsg, ws);
      break;

    case "remove":
      const removeMsg = msg as RemoveMessage;
      handleRemove(removeMsg);
      break;

    case "dice":
      const diceMsg = msg as DiceThrowMessage;
      handleDiceThrow(diceMsg);
      break;

    case "answer":
      const answerMsg = msg as AnswerMessage;
      handleAnswer(answerMsg);
      break;

    case "regPawn":
      const pawnMsg = msg as PawnRegisterMessage;
      handlePawnRegister(pawnMsg, ws);
      break;

    case "movePawn":
      const movePawnMsg = msg as MovePawnMessage;
      handleMovePawn(movePawnMsg.nick, movePawnMsg.fieldsToMove, movePawnMsg.shouldMoveFlag);
      break;

    case "question":
      const questionMsg = msg as QuestionMessage;
      handleQuestion(questionMsg);
      break;

    case "startGame":
      handleStartGame();
      break;

    case "reset":
      console.log("Game ended, resetting state");

    case "gameFinish":
      console.log("Received game finish msg");
      const gameFinishMsg = msg as GameFinishMessage;
      handleGameFinish(gameFinishMsg);
      break;

    default:
      console.error("Unknown message type", JSON.stringify(msg));
  }
};

const handlePing = (ws: WebSocket) => {
  console.log("Ping");
  ws.send(JSON.stringify({ type: "pong" }));
};

  function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

let nicks = [
  "żółw",
  "wiewiórka",
  "mysz",
  "pies",
  "kot",
  "słoń",
  "miś",
  "ryba",
  "kruk",
]
nicks = shuffleArray(nicks)
let currentTurn = 0;

const handleRegister = (msg: RegisterMessage, ws: WebSocket) => {
  if (msg.nick === "host") {
    if (game.clients.has("host")) {
      console.error("Host already registered");
      return;
    }
    game.clients.set("host", ws);
    console.log("Host registered");
    ws.send(JSON.stringify({ type: "registered" }));
    return;
  }
  if(game.isInProgress() || currentTurn >= nicks.length)
    return;
  // console.log("Ip address for registration: ", ws._socket.address());
  // if (Array.from(game.ip_to_nick.values()).some(ip => ip === ws._socket.remoteAddress)) {
  //   ws.send(JSON.stringify({ type: "NICK", nick: game.ip_to_nick.get(ws._socket.remoteAddress) }));
  //   return;
  // }
  let nick = nicks[currentTurn % nicks.length];
  currentTurn++;
  game.clients.set(nick, ws);
  game.order.push(nick);

  console.log("Registered", nick, game.clients.size);
  ws.send(JSON.stringify({ type: "NICK", nick: nick }));
  game.clients.get("host")?.send(JSON.stringify({ type: "newPlayer", nick }));
};

const handlePawnRegister = (msg: PawnRegisterMessage, ws: WebSocket) => {
  if (game.pawns.has(msg.nick)) {
    // TODO: handle on reconnect
    console.error("Pawn already registered");
    return;
  }
  game.pawns.set(msg.nick, ws);

  // when all connected clients except 'host' have registered their pawns
  // if (game.pawns.size + 1 === game.clients.size) {
  //   game.start();
  //   notifyNextPlayer();
  // }

  console.log(
    `Pawn registered: ${msg.nick}, ${game.pawns.size} of ${game.clients.size} pawns registered`
  );
};

const handleMovePawn = (nick: string, fieldsToMove: number, shouldMoveFlag: boolean) => {
  const ws = game.pawns.get(nick);
  console.log("Move pawn", nick, fieldsToMove);
  ws?.send(
    JSON.stringify({ type: "movePawn", fieldsToMove: fieldsToMove, nick: nick, shouldMoveFlag: shouldMoveFlag})
  );
};

const handleQuestion = (msg: QuestionMessage) => {
  if (msg.nick === "" && msg.possibleAnswers === 0) {
    game.validateQuestion(game.getActivePlayer());
    console.log("No question");
    game.validateAnswer(game.getActivePlayer(), "No Question");
    notifyNextPlayer();
    return;
  }

  const ws = game.validateQuestion(msg.nick);

  if (ws) {
    const possibleAnswers = msg.possibleAnswers;
    console.log("Question:", msg.nick, msg.possibleAnswers);
    ws?.send(JSON.stringify({ type: "question", possibleAnswers }));
  }
};

const handleMessageToClient = (msg: ServerMessage, ws: WebSocket) => {
  ws.send(JSON.stringify(msg));
};

export const handleDiceThrow = (msg: DiceThrowMessage) => {
  if (game.validateDiceThrow(msg.nick, msg.dice)) {
    handleMovePawn(msg.nick, msg.dice);

    // handleQuestion({ type: "question", nick: game.order[0] }) // TEST FLOW! REMOVE LATER!
  }
};

export const handleAnswer = (msg: AnswerMessage) => {
  const who = game.getActivePlayer();
  if (game.validateAnswer(who, msg.answer)) {
    notifyNextPlayer();
    if (msg.answer === "Timeout") {
      game.clients.get(who)?.send(JSON.stringify({ type: "timeout" }));
    }

    const ws = game.pawns.get(msg.nick);

    ws?.send(
      JSON.stringify({ type: "answer", answer: msg.answer, nick: msg.nick })
    );

    console.log("Answer", msg.answer, msg.nick);
  }
};

const notifyNextPlayer = () => {
  const next = game.clients.get(game.order[0]);

  if (next == undefined) {
    console.error("No next player");
    return;
  }
  next.send(JSON.stringify({ type: "throwDice", nick: game.order[0] }));
};

const handleGameFinish = (msg: GameFinishMessage) => {
  console.log("Game Finish Message");
  const clientEntries = Array.from(game.clients.entries());
  clientEntries.forEach(([key, value]) => {
    const ws = value;
    ws?.send(JSON.stringify({ type: "gameFinish" }));
  });

  game.clients.clear();
  game.pawns.clear();
  game.order = [];
  currentTurn = 0;
};

const handleRemove = (msg: RemoveMessage) => {
  console.log("Remove ", msg.nick);
  game.clients.delete(msg.nick);
  game.order = game.order.filter(item => item !== msg.nick);
  game.pawns.delete(msg.nick);
}

const handleStartGame = () => {
  game.start();
  notifyNextPlayer();
}
