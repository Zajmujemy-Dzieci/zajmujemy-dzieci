import { useState } from "react";
import { Player } from "../../types/Player";
import { twMerge } from "tailwind-merge";
import { BoardField } from "./GameBoardComponent";

type GameBoardPawnProps = {
  player: Player;
  shift: { x: number; y: number };
  boardFields: BoardField[];
};

// TODO: socket communication attachment
function redirectToQuestionPage(player: Player) {}

function handleFinishGame(player: Player) {}

function handleGoodField(player: Player) {}

function handleBadField(player: Player) {}

function listenOnSocket(
  player: Player,
  movePawn: (fieldsToMove: number) => void
) {
  // socket.on("movePawn", (fieldsToMove: number) => {
  //   movePawn(fieldsToMove);
  // });
}

export default function GameBoardPawn({
  player,
  shift,
  boardFields,
}: GameBoardPawnProps) {
  if (!boardFields) {
    return <div>Nie ma z kim grać...</div>;
  }
  if (!player) {
    return <div>Brak gracza...</div>;
  }
  const [currentPosition, setCurrentPosition] = useState(0);

  function movePawn(fieldsToMove: number) {
    if (fieldsToMove + currentPosition >= boardFields.length) {
      setCurrentPosition(boardFields.length - 1);
      player.score = boardFields.length - 1;
      handleFinishGame(player);
      return;
    }
    setCurrentPosition(currentPosition + fieldsToMove);
    player.score = currentPosition + fieldsToMove;
    if (boardFields[currentPosition].type == "question") {
      redirectToQuestionPage(player);
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

  listenOnSocket(player, movePawn);

  return (
    <div
      style={{
        gridRow: boardFields[currentPosition].rowClass,
        gridColumn: boardFields[currentPosition].colClass,
        transform: `translate(${shift.x}px, ${shift.y}px)`,
      }}
      // TODO: remove after connecting to socket
      onClick={() => movePawn(3)}
      className={twMerge(
        "bg-white h-6 w-6 rounded-full my-5 mx-6",
        player.background
      )}
    ></div>
  );
}
