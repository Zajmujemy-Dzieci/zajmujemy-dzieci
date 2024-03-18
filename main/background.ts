import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { QuestionList } from './question/QuestionList'
import { Question } from './question/Question'

const express = require('express');
const bodyParser = require('body-parser');

const express_app = express();
const PORT = 3000;


express_app.use(bodyParser.urlencoded({ extended: true }));

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




express_app.get('/questionTest', (req, res) => {
  const question1 = new Question("What is the capital of France?", ["Paris", "Madrid", "Berlin"], 0);
  const question2 = new Question("Who wrote 'Romeo and Juliet'?", ["Shakespeare", "Hemingway", "Tolstoy"], 0);

  const questionList = new QuestionList([question1, question2]);
  var randomQuestion: Question;
  try {
      randomQuestion = questionList.chooseRandomQuestion();
      console.log("Random question:", randomQuestion.content);
  } catch (error) {
      console.error(error.message);
  } 
  if (!randomQuestion){
    randomQuestion = new Question("Question not loaded", ["Sample1", "Sample2"], 0);
  }
     
  res.send(`
      <html>
          <head>
              <title>Test Pytania</title>
          </head>
          <body>
              <h1>Test Pytania</h1>
              <p>` + randomQuestion.content + ` </p>
          </body>
      </html>
  `);
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
