import path from "path"
import { app, ipcMain } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"
import { stringify } from "querystring"

const os = require("os")
const cors = require("cors")

const express = require("express")
const bodyParser = require("body-parser")

const express_app = express()
var expressWs = require("express-ws")(express_app)
const PORT = 3000

express_app.use(bodyParser.urlencoded({ extended: true }))

express_app.use(bodyParser.urlencoded({ extended: true }))
express_app.use(cors())

express_app.get("/", (req, res) => {
	res.send(`
      <html>
          <head>
              <title>Podaj nick</title>
          </head>
          <body>
              <h1>Podaj nick</h1>
              <form action="/submit" method="post">
                  <input type="text" name="nick" placeholder="Twój nick" required>
                  <button type="submit">Zatwierdź</button>
              </form>
          </body>
      </html>
  `)
})

function getIpAddress() {
	const networkInterfaces = os.networkInterfaces()
	let ipv4Address
	Object.keys(networkInterfaces).forEach(interfaceName => {
		networkInterfaces[interfaceName].forEach(networkInterface => {
			if (
				networkInterface.family === "IPv4" &&
				!networkInterface.internal
			) {
				ipv4Address = networkInterface.address
			}
		})
	})
	return ipv4Address
}

express_app.get("/ipaddress", (req, res) => {
	const networkInterfaces = os.networkInterfaces()
	let ipv4Address = getIpAddress()
	if (ipv4Address) {
		res.json(ipv4Address)
	} else {
		res.status(500).json({ error: "Nie udało się znaleźć adresu IPv4" })
	}
})

express_app.post("/submit", (req, res) => {
	var nick = req.body.nick
	console.log(nick)
	res.send(`
        <html>
            <head>
                <title>Witaj!</title>
            </head>
            <body>
                <h1>Witaj</h1>
                <p>Dziękujemy za podanie nicku.</p>
            </body>
        </html>
    `)
})

express_app.get("/websockets", (req, res) => {
	// res.send("static/websockets.html", { root: __dirname })
	res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Websockets demo</title>
    
        <script>
            const ws = new WebSocket('ws://localhost:3000/ws');
            ws.onopen = () => {
                console.log('connected');
                ws.send(JSON.stringify({ type: 'register', nick: 'test' }));
            };
            ws.onmessage = (msg) => {
                console.log(msg.data);
            };
    
            const init = () => {
                document.getElementById('pinger').addEventListener('click', () => {
                    console.log('Ping');
                    ws.send(JSON.stringify({type: 'ping'}));
            });
            }
            
            window.onload = init
        </script>
    </head>
    <body>
    
        <button id="pinger">Ping</button>
        
    </body>
    </html>`)
})

express_app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`)
})

let clients = new Map<string, WebSocket>()

interface Message {
	type: "register" | "ping"
}

interface RegisterMessage extends Message {
	type: "register"
	nick: string
}

express_app.ws("/ws", function (ws, req) {
	ws.on("message", function (msg) {
		const parsed = JSON.parse(msg) as Message
		switch (parsed?.type) {
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
				console.error("Unknown message type", JSON.stringify(parsed))
		}
	})
})

const isProd = process.env.NODE_ENV === "production"

if (isProd) {
	serve({ directory: "app" })
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
	await app.whenReady()

	const mainWindow = createWindow("main", {
		width: 1000,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			sandbox: false,
			nodeIntegration: true,
		},
	})

	if (isProd) {
		await mainWindow.loadURL("app://./home")
	} else {
		const port = process.argv[2]
		await mainWindow.loadURL(`http://localhost:${port}/home`)
		mainWindow.webContents.openDevTools()
	}
})()

app.on("window-all-closed", () => {
	app.quit()
})

ipcMain.on("message", async (event, arg) => {
	event.reply("message", `${arg} World!`)
})
