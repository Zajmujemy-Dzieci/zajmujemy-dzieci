// This is dumb, but html files do not like building
export const websockets_client = (address: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Websockets demo</title>

    <script>
      const ws = new WebSocket('ws://${address}:3000/ws');
      ws.onopen = () => {
          console.log('connected');
          handleNick('test', ws)
      };

      ws.onmessage = (msg) => {
        const parsed = JSON.parse(msg.data);
        console.log(parsed);
        switch (parsed?.type) {
         
          case 'throwDice':
            handleDiceThrow(ws);
            break;
            
          case 'question':
            handleQuestion(parsed, ws);
            break;
            
          case 'registered':
            handleRegistered();
            break;
          
          default:
            console.error('Unknown message type:', parsed.type);
        }
      };
        //Handlers Start
         const handleQuestion = (question, ws) => {
        
            console.log("Received Question:", question.content);
            console.log("Answers:");
            question.answers.forEach((answer) => {
                console.log(answer);
            });
        
            // Select a random answer (for demonstration)
            const index = Math.floor(Math.random() * question.answers.length);
            console.log("Selected Answer:", question.answers[index]);
        
            sendAnswer(question.answers[index], ws);
        };
        
        const sendAnswer = (selectedAnswer, ws) => {
            ws.send(JSON.stringify({ type: "answer", answer: selectedAnswer, destination: "host" }));
        };
        
         const handleDiceThrow = (ws) => {
            // Generate a random number between 1 and 6 for the dice throw (for demonstration)
            const diceResult = Math.floor(Math.random() * 6) + 1;
            console.log("Dice Result:", diceResult);
        
            ws.send(JSON.stringify({ type: "dice", dice: diceResult, destination: "host" }));
        };
        
         const handleRegistered = () => {
            console.log("registered successfully!");
        };
            
         const handleNick = (nick, ws) => {
            ws.send(JSON.stringify({ type: 'register', nick: nick, destination: "host" }));
        };
        
      //Handlers End
        const init = () => {
            //send ping to launch almost all handlers (except Nick and Registered)
            document.getElementById('pinger').addEventListener('click', () => {
                console.log('Ping');
                ws.send(JSON.stringify({type: 'ping', destination: "host"}));
            });

            document.getElementById('answer').addEventListener('click', () => {
              ws.send(JSON.stringify({type: 'answer', answer: 'C', destination: "host"}));
            });
            
            document.getElementById('dice').addEventListener('click', () => {
              handleDiceThrow(ws);
            });
        }

        window.onload = init
    </script>
</head>
<body>

    <button id="pinger">Ping</button>
    <button id="answer">Answer</button>
    <button id="dice">Dice</button>
    
</body>
</html>`
