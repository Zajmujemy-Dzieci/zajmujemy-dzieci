import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const os = require('os');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const express_app = express();
const PORT = 3000;


express_app.use(bodyParser.urlencoded({ extended: true }));
express_app.use(cors());

express_app.get('/', (req, res) => {
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
  `);
});

function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipv4Address;
  Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName].forEach(networkInterface => {
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        ipv4Address = networkInterface.address;
      }
    });
  });
  return ipv4Address;
}

express_app.get('/ipaddress', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  let ipv4Address = getIpAddress();
  if (ipv4Address) {
    res.json(ipv4Address );
  } else {
    res.status(500).json({ error: 'Nie udało się znaleźć adresu IPv4' });
  }
});


express_app.post('/submit', (req, res) => {
    var nick = req.body.nick;
    console.log(nick);
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
    `);
});


express_app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      nodeIntegration: true
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
