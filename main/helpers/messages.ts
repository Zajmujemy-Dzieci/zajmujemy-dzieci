export interface ClientMessage {
	type: "register" | "ping" | "dice" | "answer" | "regPawn" | "movePawn" | "question" | 'NICK' | 'gameFinish'
}

export interface RegisterMessage extends ClientMessage {
	type: "register"
	nick: string
}

export interface DiceThrowMessage extends ClientMessage {
	type: "dice"
	dice: 1 | 2 | 3 | 4 | 5 | 6
	nick: string
}

export interface AnswerMessage extends ClientMessage {
	type: "answer"
	answer: string
	nick: string
}

export interface ServerMessage {
	type: "pong" | "throwDice" | "registered"
}

export interface PawnRegisterMessage extends ClientMessage {
	type: "regPawn"
	nick: string
}

export interface MovePawnMessage extends ClientMessage {
	type: "movePawn"
	fieldsToMove: number,
	nick: string
}

export interface QuestionMessage extends ClientMessage {
	type: "question",
	nick: string
	possibleAnswers: number
}

export interface NickMessage extends ClientMessage {
	type: "NICK",
	nick: string
}

export interface GameFinishMessage extends ClientMessage {
	type: "gameFinish"
}


export type TurnMessage = {
	type: "yourTurn"
	nick: string
}


// This should not stay here
export let clients = new Map<string, WebSocket>()
export let pawns = new Map<string, WebSocket>()

export const handleMessage = (msg: ClientMessage, ws: WebSocket) => {
	switch (msg.type) {
		case "ping":
			handlePing(ws)
			break

		case "register":
			const registerMsg = msg as RegisterMessage
			handleRegister(registerMsg, ws)
			break

		case "dice":
			const diceMsg = msg as DiceThrowMessage
			handleDiceThrow(diceMsg)
			break

		case "answer":
			const answerMsg = msg as AnswerMessage
			handleAnswer(answerMsg)
			break
		
		case "regPawn":
			const pawnMsg = msg as PawnRegisterMessage
			handlePawnRegister(pawnMsg, ws)
			break
		
		case "movePawn":
			const movePawnMsg = msg as MovePawnMessage
			handleMovePawn(movePawnMsg.nick, movePawnMsg.fieldsToMove);
			break

		case "question":
			const questionMsg = msg as QuestionMessage
			handleQuestion(questionMsg);
			break

		case "gameFinish":
			console.log("Received game finish msg");
			const gameFinishMsg = msg as GameFinishMessage;
			handleGameFinish(gameFinishMsg)
			break;
		

		default:
			console.error("Unknown message type", JSON.stringify(msg))
	}
}

export const throwDice = (nick: string) => {
	const ws = clients.get(nick)
	ws.send(JSON.stringify({ type: "throwDice" }))
}

const handlePing = (ws: WebSocket) => {
	console.log("Ping")
	ws.send(JSON.stringify({ type: "pong" }))
}

const nicks = ["żółw", "wiewiórka", "szynszyla", "pies", "kot", "słoń"]
let currentTurn = 0

const handleRegister = (msg: RegisterMessage, ws: WebSocket) => {
	if (msg.nick === "host") {
		if (clients.has("host")) {
			console.error("Host already registered")
			return
		}
		clients.set("host", ws)
		console.log("Host registered")
		ws.send(JSON.stringify({ type: "registered" }))
		return
	}
	let nick = nicks[currentTurn]
	currentTurn++
	clients.set(nick, ws)
	console.log("Registered", nick, clients.size)
	ws.send(JSON.stringify({ type: "NICK", nick: nick }))
	clients.get("host")?.send(JSON.stringify({ type: "newPlayer", nick }))
}

const handlePawnRegister = (msg: PawnRegisterMessage, ws: WebSocket) => {
	if (pawns.has(msg.nick)) {
		console.error("Pawn already registered")
		return
	}
	pawns.set(msg.nick, ws)
	console.log("Pawn registered" + msg.nick)
}

const handleMovePawn = (nick: string, fieldsToMove: number) => {
	const ws = pawns.get(nick)
	console.log("Move pawn", nick, fieldsToMove)
	ws?.send(JSON.stringify({ type: "movePawn", fieldsToMove: fieldsToMove, nick: nick }))
}

const handleQuestion = (msg: QuestionMessage) => {
	const ws = clients.get(msg.nick)
	const possibleAnswers = msg.possibleAnswers
	console.log("Question", msg.nick,msg.possibleAnswers)
	ws?.send(JSON.stringify({ type: "question" ,possibleAnswers: possibleAnswers}))
}

const handleMessageToClient = (msg: ServerMessage, ws: WebSocket) => {
	ws.send(JSON.stringify(msg))
}

const handleDiceThrow = (msg: DiceThrowMessage) => {
	console.log("Dice throw", msg.dice)
	handleMovePawn(msg.nick, msg.dice)
}

const handleAnswer = (msg: AnswerMessage) => {
	console.log("Answer", msg.answer, msg.nick)
	const ws = pawns.get(msg.nick)
	ws?.send(JSON.stringify({ type: "answer" ,answer:msg.answer ,nick:msg.nick}))
	
}

const handleGameFinish = (msg : GameFinishMessage) => {
	console.log("Game Finish Message")
	const clientEntries = Array.from(clients.entries());
	clientEntries.forEach(([key,value]) => {
		const ws = value; 
		ws?.send(JSON.stringify({ type: "gameFinish"}))
	})
	
}