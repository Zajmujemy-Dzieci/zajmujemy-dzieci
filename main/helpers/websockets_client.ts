// This is dumb, but html files do not like building

export const websockets_client = (address: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Websockets demo</title>

    <script>
        const MAX_ANSWERS = 6;
        let chosenAnswer = 'U'; 
        const possibleAnswers = ['A','B','C','D','E','F'];

        const ws = new WebSocket('ws://${address}:3000/ws');
        let nick = "";
        ws.onopen = () => {
            console.log('connected');
            ws.send(JSON.stringify({ type: 'register', nick: 'test' }));
        };

        ws.onmessage = (msg) => {
            const parsed = JSON.parse(msg.data);
            console.log(parsed);
            if (parsed?.type === 'NICK'){
                nick = parsed.nick;
                console.log('Nick:', nick);
                showWaitForGameStart(true);

            }
            if(parsed?.type === 'throwDice') 
                ws.send(JSON.stringify({ type: 'dice', dice: Math.floor(Math.random() * 6) + 1 }));
            if(parsed?.type === 'question'){
                console.log("call")
                console.log(parsed.possibleAnswers)
                showAnswers(parsed.possibleAnswers); //Tu nalezy przeslac ile odpowiedzi trzeba wyswietlic
                //Przyda sie jeszcze 
            }
            if(parsed?.type === 'timeout') // only useful for timeout
                showWaitForYourTurn(true);
            if(parsed?.type === 'gameFinish'){
                showWaitForYourTurn(false); 
                showAnswers(0); 
                showFinishGame(true); 
            }
        };

      

        const init = () => {
            document.getElementById('pinger').addEventListener('click', () => {
                console.log('Ping');
                ws.send(JSON.stringify({type: 'ping'}));
            });

            document.getElementById('answer').addEventListener('click', () => {
                ws.send(JSON.stringify({type: 'answer', answer: 'C', nick:nick}));
            });
            document.getElementById('throwDice').addEventListener('click', () => {
                console.log('Throwing dice' + nick);
                document.getElementById('turn').innerText = "Czekaj..";
                ws.send(JSON.stringify({type: 'dice', dice: Math.floor(Math.random() * 6) + 1, nick: nick}));
            });

            let answers = document.getElementsByClassName("ans");
            for(let i =0; i<answers.length; i++){
                answers[i].addEventListener('click',function(){
                    chosenAnswer = possibleAnswers[i];
                    let confirmButton =document.getElementById("confirmButton");

                    confirmButton.addEventListener("click",function(event){      
                        let confirmationDiv = document.getElementById("outerDiv");
                        confirmationDiv.style.display = "none";  
                        showAnswers(0); 
                        showWaitForYourTurn(true);
                        sendAnswer(chosenAnswer);
                    });
                
                    askToConfirm(possibleAnswers[i]);                
                });
            }

            let cancelButton = document.getElementById("cancelButton");
            cancelButton.addEventListener('click',function(event){
                let confirmationDiv = document.getElementById("outerDiv");
                confirmationDiv.style.display = "none";     
            });
        }

        window.onload = init
        
        
        function showAnswers(howMany){    
            if(howMany == 0){ 
                let answersDiv = document.getElementById("answers");
                answersDiv.style.display = "none";

            }     
            else{ 
                showWaitForYourTurn(false);
                let answersDiv = document.getElementById("answers");
                answersDiv.style.display = "block";
                let answers = document.getElementsByClassName("ans");
                for(let i = howMany; i<MAX_ANSWERS; i++) answers[i].classList.add("hidden");
                for(let i=0; i<howMany; i++) answers[i].classList.remove("hidden");
            }              
        }

        function showWaitForYourTurn(showOrNot){
            let waitDiv = document.getElementById("waitDiv");
            let children = waitDiv.children;
            children[1].innerText = "Czekaj na swoją kolej"
            waitDiv.style.display = showOrNot ? "flex" : "none";        
        }

        function showWaitForGameStart(showOrNot){
            let waitDiv = document.getElementById("waitDiv");
            let children = waitDiv.children;
            children[1].innerText = "Poczekaj na rozpoczęcie gry"
            waitDiv.style.display = showOrNot ? "flex" : "none";        
        }

        function showFinishGame(showOrNot){
            let waitDiv = document.getElementById("waitDiv");
            let children = waitDiv.children;
            children[1].innerText = "Gra zakończyła się"
            children[0].src = "./images/finishFlag.png"

            waitDiv.style.display = showOrNot ? "flex" : "none";            
 
        }

        function askToConfirm(whichAns){
            let selectionAnnouncement = document.getElementById("selectionAnnouncement");
            selectionAnnouncement.innerText = "Wybrano odpowiedź: " + whichAns;
            let confirmationDiv = document.getElementById("outerDiv");
            confirmationDiv.style.display = "flex";
        }

        function sendAnswer(answer){
            ws.send(JSON.stringify({ type: 'answer', nick:nick ,answer: answer }));
        }        

        

    </script>

    <style>
        #answers{
            vertical-align: center;
            width: 100%;
            height: 20%;
            text-align: center;
            font-size: 40px;
            border: 2px solid orange;
            display: none
        }
        #description{
            width: 100%;
            height: 20%;
            text-align: center;
            font-size: 40px;
            border: 2px solid black;
            background-color: orange;
            border-radius: 30px;

        }
        .ans{
            border: 2px solid black;
            border-radius: 30px;
            margin: 5px;
        }
        .ansOdd{
            background: linear-gradient(to bottom right, purple, pink);
        }
        .ansEven{
            background: linear-gradient(to bottom right, blue, lightgreen);
        }
        .ansOdd:hover{
            background: linear-gradient(to bottom right, green, yellow);
        }
        .ansEven:hover{
            background: linear-gradient(to bottom right, green, yellow);
        }
        .hidden{
            display: none;
        }

        #outerDiv{
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            justify-content: center;
            align-items: center;
            border: 5px solid black;
            display: none;
            text-align: center;
            font-size: 30px;
        }
        #confirmationDiv{                   
            background: purple;
            border: 2px solid black;         
            padding: 20px;
            
        }
        #confirmButton{
            width: 200px;
            height: 100px;
            font-size: 30px;
        }
        #cancelButton{
            width: 200px;
            height: 100px;
            font-size: 30px;
        }
        body{
            background-color: lightblue;
            justify-content: center;
            display: flex;
            flex-direction: column;
        }
        #logoDiv{
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        #waitDiv{
            margin-top: 10%;
            justify-content: center;
            margin-bottom: 20px;
            flex-direction: column;
            align-items: center;
            font-size: 40px;
            display: flex;
            text-align: center
        }
        img{
            display: block;
            width: 20%;
        }
    </style>

</head>
<body>

    <h1 id="nick">Jesteś: </h1>
    <h1 id="turn">Czekaj..</h1>

    <button id="pinger">Ping</button>
    <button id="answer">Answer</button>
    <button id="throwDice">Throw dice</button>

    <div id="logoDiv">
        <img src="./images/logo.png"></img>
    </div>

    <div id="waitDiv">
        <img src="./images/hourglass.png" id="waitDivImg"></img>
        <p>Poczekaj na rozpoczęcie gry</p>
    </div>

    <div id="answers">
        <div id="description">Wybierz odpowiedź</div>
        <div class="ans ansOdd" id="ans1" >A</div>
        <div class="ans ansEven" id="ans2" >B</div>
        <div class="ans ansOdd" id="ans3">C</div>
        <div class="ans ansEven" id="ans4">D</div>
        <div class="ans ansOdd" id="ans5">E</div>
        <div class="ans ansEven" id="ans6">F</div>
    </div>

    <div id="outerDiv">
        <div id="confirmationDiv">
            <p id="selectionAnnouncement">Wybrano odpowiedź: A</p>
            <button id="confirmButton">Potwierdź</button>
            <button id="cancelButton">Anuluj</button>
        </div>
    </div>
    

</body>
</html>`;
