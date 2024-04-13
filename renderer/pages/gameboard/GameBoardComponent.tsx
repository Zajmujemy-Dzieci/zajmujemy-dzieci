import { twMerge } from "tailwind-merge";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { Player } from "../../types/Player";
import GameBoardPawn from "./GameBoardPawn";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { webSocketAtom } from "../../models/WebSocketAtom";
import SpecialPopupComponent from "./SpecialPopupComponent";

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
      return "bg-childRed";
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

  const [ws, setWs] = useAtom(webSocketAtom);

  const {
    numberOfQuestionFields,
    numberOfGoodSpecialFields,
    numberOfBadSpecialFields,
  } = configuration;
  function countNumberOfColumns(numberOfQuestionFields: number) {
    if (numberOfQuestionFields < 6) return 7;
    if (numberOfQuestionFields < 10) return 7;
    if (numberOfQuestionFields < 12) return 8;
    if (numberOfQuestionFields < 16) return 9;
    else return 9;
  }

  const numberOfColumns = countNumberOfColumns(numberOfQuestionFields);
  console.log("numberOfColumns", numberOfColumns);
  const totalFields = 2 * numberOfQuestionFields + 2;
  const numberOfRows = Math.ceil(totalFields / numberOfColumns) + 2;
  console.log("numberOfRows", numberOfRows);

  const getBoardFieldSpecialty = (index: number): BoardFieldSpecialty => {
    if (index === totalFields - 1) return "start";
    if (index % (2 * (numberOfGoodSpecialFields - 1)) === 0) return "good";
    if (index % (2 * (numberOfBadSpecialFields - 1)) === 0) return "bad";

    return index % 2 === 0 ? "empty" : "question";
  };

  let currentColumn = 1;
  let currentRow = 2;
  let target = numberOfRows;
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
      target += numberOfRows;
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
  }

  return (
    <div className={`w-full h-full place-content-center grid gap-4`}>
      {isPopupOpen && (
        <div onClick={() => setPopupOpen(false)}>
          <SpecialPopupComponent
            text={popupText}
            isOpen={isPopupOpen}
            onClose={() => setPopupOpen(false)}
          />
        </div>
      )}
      <div
        style={{ gridRow: 1, gridColumn: 1 }}
        className="bg-childBlack h-28 w-28"
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
              "h-28 w-28 flex flex-wrap justify-center content-center items-center p-3"
            )}
          ></div>
        );
      })}
      {players.map((player, i) => (
        <GameBoardPawn
          player={player}
          shift={{
            x: (i % 3) * 33,
            y: Math.floor((Math.floor(i / 3) * 100 * 3) / players.length),
          }}
          boardFields={gridPositions}
          handleOpenSpecialPopup={handleOpenSpecialPopup}
        />
      ))}
    </div>
  );
}
