export interface ClientMessage {
	type: "register" | "ping" | "dice" | "answer";
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
	answer: number;
}

export interface ServerMessage {
	type: "pong" | "throwDice" | "registered";
}

export type TurnMessage = {
	type: "yourTurn";
	nick: string;
};

// This should not stay here
export let clients = new Map<string, WebSocket>();

export const handleMessage = (msg: ClientMessage, ws: WebSocket) => {
	switch (msg.type) {
		case "ping":
			console.log("Ping");
			sendYourTurn("test")
			throwDice("test")
			sendQuestion("What is the capital of France?",
				["Paris", "Berlin", "Madrid", "Rome"],
				"test")
			break;

		case "register":
			const registerMsg = msg as RegisterMessage;
			handleRegister(registerMsg, ws);
			break;

		case "dice":
			const diceMsg = msg as DiceThrowMessage;
			handleDiceThrow(diceMsg);
			break;

		case "answer":
			const answerMsg = msg as AnswerMessage;
			handleAnswer(answerMsg);
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
	clients.set(msg.nick, ws);
	console.log("Registered", msg.nick, clients.size);
	ws.send(JSON.stringify({ type: "registered" }));
};

const handleDiceThrow = (msg: DiceThrowMessage) => {
	console.log("Dice throw", msg.dice);
};

const handleAnswer = (msg: AnswerMessage) => {
	console.log("Answer", msg.answer);
};

const sendQuestion = (content: string, answers: string[], nick: string) => {
	const ws = clients.get(nick);
	const message = JSON.stringify({
		type: "question",
		content: content,
		answers: answers,
	});

	ws?.send(message);
};

const sendYourTurn = (nick: string) => {
	const ws = clients.get(nick);
	const message = JSON.stringify({
		type: "yourTurn",
		nick: nick,
	});

	ws?.send(message);
};

