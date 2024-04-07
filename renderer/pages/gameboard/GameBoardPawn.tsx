import { useState } from "react";
import { Player } from "../../types/Player";
import { twMerge } from "tailwind-merge";
import { BoardField } from "./GameBoardComponent";

type GameBoardPawnProps = {
  player: Player;
  shift: { x: number; y: number };
  boardFields: BoardField[];
  handleOpenSpecialPopup: (text: string) => void;
};

// TODO: socket communication attachment
function redirectToQuestionPage(player: Player) {}

function handleFinishGame(player: Player) {}




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
    handleOpenSpecialPopup = (text: string) => {},
  }: GameBoardPawnProps) {
    if (!boardFields) {
      return <div>Nie ma z kim grać...</div>;
    }
    if (!player) {
      return <div>Brak gracza...</div>;
    }

    async function handleGoodField(player: Player) {
      await handleOpenSpecialPopup('Idziesz 3 pola do przodu!');
      // TODO: communicates + actions SCRUM-55
    }

    async function handleBadField(player: Player) {
      await handleOpenSpecialPopup('Idziesz 3 pola do tyłu!');
      // TODO: communicates + actions SCRUM-55
    }

    const [currentPosition, setCurrentPosition] = useState(0);
    
    async function movePawn(fieldsToMove: number) {
      await setCurrentPosition(prevPosition => {
        const newPosition = prevPosition + fieldsToMove;
      if (newPosition >= boardFields.length-1) {
        handleFinishGame(player);
        return boardFields.length - 1;
      }
      if (boardFields[newPosition].type === "question") {
        redirectToQuestionPage(player);
      } else if (boardFields[newPosition].type === "finish") {
        handleFinishGame(player);
      } else if (boardFields[newPosition].type === "good") {
        handleGoodField(player);
      } else if (boardFields[newPosition].type === "bad") {
        handleBadField(player);
      }
      return newPosition;
    });
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
      onClick={() => movePawn(1)}
      className={twMerge(
        "bg-white h-6 w-6 rounded-full my-5 mx-6",
        player.background
      )}
    ></div>
  );
}

