import path from "path"
import { app, ipcMain } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"
import { stringify } from "querystring"
import { ClientMessage, handleMessage } from "./helpers/messages"
import { websockets_client } from "./helpers/websockets_client"

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

function getIpAddress() {
	const networkInterfaces = os.networkInterfaces()
	let ipv4Addresses: string[] = []
	let ipv4Address
	Object.keys(networkInterfaces).forEach(interfaceName => {
		networkInterfaces[interfaceName].forEach(networkInterface => {
			if (
				networkInterface.family === "IPv4" && networkInterface.address.startsWith('192.168')
			) {
				ipv4Addresses.push(networkInterface.address)
			}
		})
	})
	if ('192.168.137.1' in ipv4Addresses) {
		return '192.168.137.1';
	}
	return ipv4Addresses[0]
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


express_app.get("/", (req, res) => {
	const address = getIpAddress() as any as string
	console.log("here", address)
	res.send(websockets_client(address))
})

express_app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`)
})

express_app.ws("/ws", function (ws, req) {
	ws.on("message", function (msg) {
		let parsed = null
		try {
			parsed = JSON.parse(msg) as ClientMessage
		} catch (error) {
			console.error("Invalid message", msg)
		}

		handleMessage(parsed, ws)
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
		autoHideMenuBar: true,
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
