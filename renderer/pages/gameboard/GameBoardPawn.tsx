import { useEffect, useState } from "react";
import { Player } from "../../types/Player";
import { twMerge } from "tailwind-merge";
import { BoardField } from "./GameBoardComponent";
import axios, { Axios, AxiosResponse } from "axios";
import LazyIcon from "../../models/IconsManager";
import { loadQuestion, revealAnswer } from "./QuestionPopup";
import { Question } from "../../models/Question";

type GameBoardPawnProps = {
  player: Player;
  shift: { x: number; y: number };
  boardFields: BoardField[];
  handleOpenSpecialPopup: (text: string) => void;
};

// TODO: socket communication attachment
function redirectToQuestionPage(player: Player, ws: WebSocket) {  
  const sampleQuestion = new Question(
    "What is the capital of France?",
    ["Paris", "Berlin", "Madrid", "Yekaterinburgh"],
    0 
  );

  const possibleAnswers = sampleQuestion.answers.length; // To powinno byc pobierane z Question
  console.log("PosAnswers:" + possibleAnswers);
  loadQuestion(sampleQuestion);

  ws.send(JSON.stringify({ type: "question", possibleAnswers: possibleAnswers, nick: player.nick }));


}

function handleFinishGame(player: Player, ws: WebSocket) {
  ws.send(JSON.stringify({ type: "gameFinish"}));
}

export default function GameBoardPawn({
  player,
  shift,
  boardFields,
  handleOpenSpecialPopup = (text: string) => {},
}: GameBoardPawnProps) {
  if (!boardFields) {
    return <div>Nie ma z kim grać...</div>;
  }
  if (!player) {
    return <div>Brak gracza...</div>;
  }
  const [currentPosition, setCurrentPosition] = useState(0);
  const [ws, setWs] = useState<WebSocket>(
    new WebSocket("ws://localhost:3000/ws")
  );
  const [ipAddress, setIPAddress] = useState<string>("");

  function handleConnection(response: AxiosResponse) {
    setIPAddress(response.data);
    const newWs = new WebSocket(`ws://${response.data}:3000/ws`);
    setWs(newWs);
    if (newWs) {
      newWs.onopen = async () => {
        console.log("Connected to server");
        newWs.send(JSON.stringify({ type: "regPawn", nick: player.nick }));
      };
      newWs.onmessage = (event) => {
        let data = JSON.parse(event.data);
        console.log("Received message: ", event.data);
        console.log("Data type: ", data.type);
        if (data.type === "movePawn" && data.nick == player.nick) {
          movePawn(data.fieldsToMove);
        }
        else if(data.type == 'answer' && data.nick == player.nick){
          revealAnswer(data.answer)
        }
      };
    }
  }

  useEffect(() => {
    axios
      .get<string>("http://localhost:3000/ipaddress")
      .then((response) => handleConnection(response))
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
      });
  }, []);

  async function handleGoodField(player: Player, ws: WebSocket) {
    await handleOpenSpecialPopup("Idziesz 3 pola do przodu!");
    // TODO: communicates + actions SCRUM-55
  }

  async function handleBadField(player: Player, ws: WebSocket) {
    await handleOpenSpecialPopup("Idziesz 3 pola do tyłu!");
    // TODO: communicates + actions SCRUM-55
  }

  async function movePawn(fieldsToMove: number) {
    await setCurrentPosition((prevPosition) => {
      const newPosition = prevPosition + fieldsToMove;
      if (newPosition >= boardFields.length - 1) {
        player.score = boardFields.length - 1;
        handleFinishGame(player, ws);
        return boardFields.length - 1;
      }
      player.score = currentPosition + fieldsToMove;
      if (boardFields[newPosition].type !== "question") {
        ws.send(JSON.stringify({ type: "question", nick: '', possibleAnswers: 0 }));
        console.log("No question")
      }
      if (boardFields[newPosition].type === "question") {
        redirectToQuestionPage(player, ws);
      } else if (boardFields[newPosition].type === "finish") {
        handleFinishGame(player, ws);
      } else if (boardFields[newPosition].type === "good") {
        handleGoodField(player, ws);
      } else if (boardFields[newPosition].type === "bad") {
        handleBadField(player, ws);
      }
      return newPosition;
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gridRow: boardFields[currentPosition].rowClass,
        gridColumn: boardFields[currentPosition].colClass,
        transform: `translate(${shift.x}px, ${shift.y}px)`,
      }}
      // TODO: remove after connecting to socket
      onClick={() => movePawn(1)}
      className={twMerge(
        "bg-white h-6 w-6 rounded-full my-2.5 mx-2.5",
        player.background
      )}
    >
      <LazyIcon iconName={player.iconName} style={{height: "80%", width: "80%"}}/>
    </div>
  );
}
