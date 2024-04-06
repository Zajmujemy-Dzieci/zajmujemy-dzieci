import { Dispatch, SetStateAction, useState } from "react";
import { Player } from "../../types/Player";
import { twMerge } from "tailwind-merge";
import { BoardField } from "./GameBoardComponent";
import { WebSocketState, webSocketAtom } from "../../models/WebsocketAtom";
import { useAtom } from "jotai";
// import { sendDicePermission } from "../../models/WebsocketAtom";
import { listenOnSocket } from "../websocket_connection";
import { sendQuestion } from "../websocket_connection";

type GameBoardPawnProps = {
  player: Player;
  shift: { x: number; y: number };
  boardFields: BoardField[];
  showQuestion: (player: Player) => void;
  showAnswer: (answer: string) => void;
};

// TODO: socket communication attachment
function redirectToQuestionPage(
  player: Player,
  ws: WebSocketState,
  showQuestion: (player: Player) => void
) {
  if (!ws) {
    return;
  }
  showQuestion(player);
  // TODO: load question from QuestionList
  sendQuestion(
    ws,
    "Czy wiesz, jakie jest najczęściej występujące imię w Polsce?",
    ["Tak", "Nie", "Nie wiem"],
    player.nick
  );
}

function handleFinishGame(player: Player) {}

function handleGoodField(player: Player) {}

function handleBadField(player: Player) {}

function communicateWithPlayer(
  ws: WebSocketState,
  player: Player,
  movePawn: (fieldsToMove: number) => void,
  showAnswer: (answer: string) => void
) {
  if (!ws) {
    return;
  }
  listenOnSocket(ws, movePawn, showAnswer);
}

export default function GameBoardPawn({
  player,
  shift,
  boardFields,
  showQuestion,
  showAnswer,
}: GameBoardPawnProps) {
  if (!boardFields) {
    return <div>Nie ma z kim grać...</div>;
  }
  if (!player) {
    return <div>Brak gracza...</div>;
  }
  const [currentPosition, setCurrentPosition] = useState(0);
  const [ws, _] = useAtom(webSocketAtom);

  function movePawn(fieldsToMove: number) {
    if (fieldsToMove + currentPosition >= boardFields.length) {
      setCurrentPosition(boardFields.length - 1);
      handleFinishGame(player);
      return;
    }
    setCurrentPosition(currentPosition + fieldsToMove);
    if (boardFields[currentPosition].type == "question") {
      redirectToQuestionPage(player, ws, showQuestion);
      return;
    }
    if (boardFields[currentPosition].type == "finish") {
      handleFinishGame(player);
      return;
    }
    if (boardFields[currentPosition].type == "good") {
      handleGoodField(player);
      return;
    }
    if (boardFields[currentPosition].type == "bad") {
      handleBadField(player);
      return;
    }
  }

  communicateWithPlayer(ws, player, movePawn, showAnswer);

  return (
    <div
      style={{
        gridRow: boardFields[currentPosition].rowClass,
        gridColumn: boardFields[currentPosition].colClass,
        transform: `translate(${shift.x}px, ${shift.y}px)`,
      }}
      // TODO: remove after connecting to socket
      onClick={() => movePawn(1)}
      className={twMerge(
        "bg-white h-6 w-6 rounded-full my-5 mx-6",
        player.background
      )}
    ></div>
  );
}
