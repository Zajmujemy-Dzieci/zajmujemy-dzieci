import { useEffect, useState } from "react";
import { Player } from "../../types/Player";
import { twMerge } from "tailwind-merge";
import { BoardField } from "./GameBoardComponent";
import axios, { Axios, AxiosResponse } from "axios";

type GameBoardPawnProps = {
  player: Player;
  shift: { x: number; y: number };
  boardFields: BoardField[];
  handleOpenSpecialPopup: (text: string) => void;
};

// TODO: socket communication attachment
function redirectToQuestionPage(player: Player, ws: WebSocket) {
  ws.send(JSON.stringify({ type: "question", nick: player.nick }));
}

function handleFinishGame(player: Player, ws: WebSocket) {}

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
          movePawn(data.fieldsToMove, false);
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

  async function handleGoodField() {
    const fieldsToMove = Math.floor(Math.random()*4) + 1;
    if (fieldsToMove == 1){ 
      await handleOpenSpecialPopup("Idziesz 1 pole do przodu!");
    }
    else {
      await handleOpenSpecialPopup(`Idziesz ${fieldsToMove} pola do przodu`);
    }
    movePawn(fieldsToMove, true);
  }

  async function handleBadField() {
    const fieldsToMove = Math.floor(Math.random()*4) + 1;
    if (fieldsToMove == 1){ 
      await handleOpenSpecialPopup("Idziesz 1 pole do tyłu!");
    }
    else {
      await handleOpenSpecialPopup(`Idziesz ${fieldsToMove} pola do tyłu`);
    }
    movePawn(-fieldsToMove, true);
  }

  async function movePawn(fieldsToMove: number, specialFlag:boolean) {
    await setCurrentPosition((prevPosition) => {
      const newPosition = prevPosition + fieldsToMove;
      if (newPosition >= boardFields.length - 1) {
        player.score = boardFields.length - 1;
        handleFinishGame(player, ws);
        return boardFields.length - 1;
      }
      if (newPosition <= 0) {
        player.score = 0;
        return 0;
      }
      player.score = currentPosition + fieldsToMove;
      if (boardFields[newPosition].type === "question" && !specialFlag) {
        redirectToQuestionPage(player, ws);
      } else if (boardFields[newPosition].type === "finish") {
        handleFinishGame(player, ws);
      } else if (boardFields[newPosition].type === "good" && !specialFlag) {
        handleGoodField();
      } else if (boardFields[newPosition].type === "bad" && !specialFlag) {
        handleBadField();
      }
      return newPosition;
    });
  }

  return (
    <div
      style={{
        gridRow: boardFields[currentPosition].rowClass,
        gridColumn: boardFields[currentPosition].colClass,
        transform: `translate(${shift.x}px, ${shift.y}px)`,
      }}
      // TODO: remove after connecting to socket
      onClick={() => movePawn(1, false)}
      className={twMerge(
        "bg-white h-6 w-6 rounded-full my-2.5 mx-2.5",
        player.background
      )}
    ></div>
  );
}
