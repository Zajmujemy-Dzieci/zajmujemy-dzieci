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
