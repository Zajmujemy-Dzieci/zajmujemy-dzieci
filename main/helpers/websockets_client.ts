// This is dumb, but html files do not like building
export const websockets_client = (address: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Websockets demo</title>

    <script>
      const ws = new WebSocket('ws://${address}:3000/ws');
      let nick = "";
      ws.onopen = () => {
          console.log('connected');
          ws.send(JSON.stringify({ type: 'register', nick: 'test' }));
      };

      ws.onmessage = (msg) => {
        const parsed = JSON.parse(msg.data);
        console.log('got', parsed);
        if (parsed?.type === 'NICK'){
            nick = parsed.nick;
            console.log('Nick:', nick);
            document.getElementById('nick').innerText = 'Jesteś: ' + nick;
        }
        if(parsed?.type === 'throwDice') {
            document.getElementById('turn').innerText = "No rusz się!";
            // ws.send(JSON.stringify({ type: 'dice', dice: Math.floor(Math.random() * 6) + 1, nick }));
        }
        if(parsed?.type === 'question')
            document.getElementById('turn').innerText = "Odpowiedz!";
        if(parsed?.type === 'timeout') // only useful for timeout
            document.getElementById('turn').innerText = "No i nie zdążyłeś!";

    };


        const init = () => {
            document.getElementById('pinger').addEventListener('click', () => {
                console.log('Ping');
                ws.send(JSON.stringify({type: 'ping'}));
            });

          document.getElementById('answer').addEventListener('click', () => {
              document.getElementById('turn').innerText = "Czekaj..";
              ws.send(JSON.stringify({type: 'answer', answer: 'C'}));
          });
            document.getElementById('throwDice').addEventListener('click', () => {
                console.log('Throwing dice' + nick);
                document.getElementById('turn').innerText = "Czekaj..";
                ws.send(JSON.stringify({type: 'dice', dice: Math.floor(Math.random() * 6) + 1, nick: nick}));
            });
        }

        window.onload = init
    </script>
</head>
<body>

    <h1 id="nick">Jesteś: </h1>
    <h1 id="turn">Czekaj..</h1>

    <button id="pinger">Ping</button>
    <button id="answer">Answer</button>
    <button id="throwDice">Throw dice</button>

</body>
</html>`;
