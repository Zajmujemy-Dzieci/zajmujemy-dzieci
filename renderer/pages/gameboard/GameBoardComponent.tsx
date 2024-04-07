import { twMerge } from "tailwind-merge";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { Player } from "../../types/Player";
import GameBoardPawn from "./GameBoardPawn";
import SpecialPopupComponent from "./SpecialPopupComponent";
import { useState } from "react";

export type BoardFieldSpecialty =
  | "question"
  | "good"
  | "bad"
  | "finish"
  | "start"
  | "empty";

export type BoardField = {
  index: number;
  colClass: number;
  rowClass: number;
  type: BoardFieldSpecialty;
};

function mapTypeOnColor(type: BoardFieldSpecialty) {
  switch (type) {
    case "question":
      return "bg-secondary";
    case "good":
      return "bg-childGreen";
    case "bad":
      return "bg-red-500";
    case "empty":
      return "bg-childWhite";
    case "start":
      return "bg-childBlack";
  }
}

// UNUSED PURPOSELY - preparing for future use

function changePosition(
  players: Player[],
  currentPlayer: Player,
  newPosition: number
) {
  const newPlayers = players.map((player) => {
    if (player.orderId === currentPlayer.orderId) {
      return { ...player, position: newPosition };
    }
    return player;
  });
  return newPlayers;
}

export default function GameBoardComponent({
  configuration,
  players,
}: {
  configuration: GameBoardConfiguration;
  players: Player[];
}) {
  if (!players) {
    return <div>Nie ma z kim grać...</div>;
  }
  if (!configuration) {
    return <div>Brak konfiguracji planszy...</div>;
  }
  const {
    numberOfQuestionFields,
    numberOfGoodSpecialFields,
    numberOfBadSpecialFields,
  } = configuration;

  const numberOfColumns = Math.floor((numberOfQuestionFields * 2) / 3) - 1;
  const totalFields = 2 * numberOfQuestionFields + 2;

  const getBoardFieldSpecialty = (index: number): BoardFieldSpecialty => {
    if (index === totalFields - 1) return "start";
    if (
      index % (numberOfBadSpecialFields + numberOfGoodSpecialFields - 1) ===
      0
    )
      return "good";
    return index % 2 === 0 ? "question" : "empty";
  };

  let currentColumn = 1;
  let currentRow = 2;
  let target = numberOfColumns - 2;
  let upOrDown = "up";
  let colClass = currentColumn;
  let rowClass = currentRow;

  const gridPositions: BoardField[] = [];
  gridPositions.push({ index: 1, colClass: 1, rowClass: 1, type: "start" });

  const getGridPosition = (index: number, numberOfColumns: number) => {
    colClass = currentColumn;
    rowClass = currentRow;
    if (index === target) {
      currentColumn++;
      colClass = currentColumn;
      currentColumn++;
      target += numberOfColumns - 3;
      if (upOrDown === "up") upOrDown = "down";
      else upOrDown = "up";
      gridPositions.push({
        index,
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index),
      });
      return { colClass, rowClass, type: getBoardFieldSpecialty(index) };
    }
    if (upOrDown === "down") {
      rowClass = currentRow;
      if (index === target - 1) {
        gridPositions.push({
          index,
          colClass,
          rowClass,
          type: getBoardFieldSpecialty(index),
        });
        return { colClass, rowClass, type: getBoardFieldSpecialty(index) };
      }
      currentRow--;
      gridPositions.push({
        index,
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index),
      });
      return { colClass, rowClass, type: getBoardFieldSpecialty(index) };
    }
    rowClass = currentRow;
    if (index === target - 1) {
      gridPositions.push({
        index,
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index),
      });
      return { colClass, rowClass, type: getBoardFieldSpecialty(index) };
    }
    currentRow++;
    gridPositions.push({
      index,
      colClass,
      rowClass,
      type: getBoardFieldSpecialty(index),
    });
    return { colClass, rowClass, type: getBoardFieldSpecialty(index) };
  };

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupText, setPopupText] = useState("");
  async function handleOpenSpecialPopup(text: string) {
    return new Promise<void>((resolve) => {
        setPopupOpen(true);
        setPopupText(text);

        setTimeout(() => {
            setPopupOpen(false);
            resolve();
        }, 5000);
    });
  };

  return (
    <div className={`w-full h-full place-content-center grid gap-4`}>
      {isPopupOpen && (
        <SpecialPopupComponent
          text={popupText}
          isOpen={isPopupOpen}
          onClose={() => setPopupOpen(false)}
        />
      )}
      <div
        style={{ gridRow: 1, gridColumn: 1 }}
        className="bg-childBlack h-32 w-32"
      >
        START
      </div>
      {Array.from({ length: totalFields - 2 }, (_, index) => {
        const {
          colClass: col,
          rowClass: row,
          type,
        } = getGridPosition(index + 2, numberOfColumns);
        return (
          <div
            key={index}
            style={{
              gridColumn: col,
              gridRow: row,
            }}
            className={twMerge(
              mapTypeOnColor(type),
              "h-32 w-32 flex flex-wrap justify-center content-center items-center p-3"
            )}
          ></div>
        );
      })}
      {players.map((player, i) => (
        <GameBoardPawn
          player={player}
          shift={{
            x: (i % 2) * 50,
            y: Math.floor((Math.floor(i / 2) * 100 * 2) / players.length),
          }}
          boardFields={gridPositions}
          handleOpenSpecialPopup={handleOpenSpecialPopup}
        />
      ))}
    </div>
  );
}
