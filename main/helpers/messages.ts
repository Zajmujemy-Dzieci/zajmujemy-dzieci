import game from './state'

export interface ClientMessage {
	type: "register" | "ping" | "dice" | "answer" | "regPawn" | "movePawn" | "question" | 'NICK' 
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
}

export interface NickMessage extends ClientMessage {
	type: "NICK",
	nick: string
}


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

		default:
			console.error("Unknown message type", JSON.stringify(msg))
	}
}

export const throwDice = (nick: string) => {
	const ws = game.clients.get(nick)

	if (!ws) {
		console.error("No such ws", nick)
		return
	}

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
		if (game.clients.has("host")) {
			console.error("Host already registered")
			return
		}
		game.clients.set("host", ws)
		console.log("Host registered")
		ws.send(JSON.stringify({ type: "registered" }))
		return
	}
	let nick = nicks[currentTurn]
	currentTurn++
	game.clients.set(nick, ws)
	game.order.push(nick)

	console.log("Registered", nick, game.clients.size)
	ws.send(JSON.stringify({ type: "NICK", nick: nick }))
	game.clients.get("host")?.send(JSON.stringify({ type: "newPlayer", nick }))
}

const handlePawnRegister = (msg: PawnRegisterMessage, ws: WebSocket) => {
	if (game.pawns.has(msg.nick)) {
		// TODO: handle on reconnect
		console.error("Pawn already registered")
		return
	}
	game.pawns.set(msg.nick, ws)

	// when all connected clients except 'host' have registered their pawns
	if(game.pawns.size + 1 === game.clients.size) {
		game.start() 
		notifyNextPlayer()
	}


	console.log(`Pawn registered: ${msg.nick}, ${game.pawns.size} of ${game.clients.size} pawns registered`)
}

const handleMovePawn = (nick: string, fieldsToMove: number) => {
	const ws = game.pawns.get(nick)
	console.log("Move pawn", nick, fieldsToMove)
	ws?.send(JSON.stringify({ type: "movePawn", fieldsToMove: fieldsToMove, nick: nick }))
}

const handleQuestion = (msg: QuestionMessage) => {
	const ws = game.validateQuestion(msg.nick)

	if(ws) 
		ws.send(JSON.stringify({ type: "question" }))
}

const handleMessageToClient = (msg: ServerMessage, ws: WebSocket) => {
	ws.send(JSON.stringify(msg))
}

export const handleDiceThrow = (msg: DiceThrowMessage) => {
	if (game.validateDiceThrow(msg.nick, msg.dice)) {
		handleMovePawn(msg.nick, msg.dice)

		handleQuestion({ type: "question", nick: game.order[0] }) // TEST FLOW! REMOVE LATER!
	}
}

export const handleAnswer = (msg: AnswerMessage) => {
	const who = game.getActivePlayer()
	if(game.validateAnswer(who, msg.answer))	{
		notifyNextPlayer()
		if (msg.answer === "Timeout") {
			game.clients.get(who)?.send(JSON.stringify({ type: "timeout" }))
		}
	}
}

const notifyNextPlayer = () => {
	const next = game.clients.get(game.order[0])

	if(next == undefined) {
		console.error("No next player")
		return
	}
	next.send(JSON.stringify({ type: "throwDice", nick: game.order[0] }))

}