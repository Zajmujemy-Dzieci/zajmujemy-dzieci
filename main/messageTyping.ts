interface Message {
	type: "register" | "ping"
}

interface RegisterMessage extends Message {
	type: "register"
	nick: string
}

// This should not stay here
let clients = new Map<string, WebSocket>()

const handleMessage = (msg: Message, ws: WebSocket) => {
	switch (msg?.type) {
		case "ping":
			console.log("Ping")
			ws.send("Pong")
			break
		case "register":
			const registerMsg = msg as RegisterMessage
			clients.set(registerMsg.nick, ws)
			ws.send("Registered")
			break
		default:
			console.error("Unknown message type", JSON.stringify(msg))
	}
}
