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
          ws.send(JSON.stringify({ type: 'register', nick: 'test' }));
      };

      ws.onmessage = (msg) => {
        const parsed = JSON.parse(msg.data);
        console.log(parsed);
        if(parsed?.type === 'throwDice') 
            ws.send(JSON.stringify({ type: 'dice', dice: Math.floor(Math.random() * 6) + 1 }));
        if(parsed?.type === 'question')
            ws.send(JSON.stringify({ type: 'answer', answer: 'C' }));
      };


        const init = () => {
            document.getElementById('pinger').addEventListener('click', () => {
                console.log('Ping');
                ws.send(JSON.stringify({type: 'ping'}));
            });

          document.getElementById('answer').addEventListener('click', () => {
              ws.send(JSON.stringify({type: 'answer', answer: 'C'}));
          });
            document.getElementById('throwDice').addEventListener('click', () => {
                ws.send(JSON.stringify({type: 'dice', dice: Math.floor(Math.random() * 6) + 1, nick: 'player1'}));
            });
            document.getElementById('throwDice2').addEventListener('click', () => {
                ws.send(JSON.stringify({type: 'dice', dice: Math.floor(Math.random() * 6) + 1, nick: 'player2'}));
            });
        }

        window.onload = init
    </script>
</head>
<body>

    <button id="pinger">Ping</button>
    <button id="answer">Answer</button>
    <button id="throwDice">Throw dice</button>
    <button id="throwDice2">Throw dice2</button>

</body>
</html>`
