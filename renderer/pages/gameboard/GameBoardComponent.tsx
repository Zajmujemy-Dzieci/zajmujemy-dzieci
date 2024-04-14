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
  const [goodFields, setGoodFields] = useState<number[]>([]);
  const [badFields, setBadFields] = useState<number[]>([]);

  const {
    numberOfQuestionFields,
    numberOfGoodSpecialFields,
    numberOfBadSpecialFields,
  } = configuration;
  function countNumberOfColumns(numberOfQuestionFields: number) {
    if (numberOfQuestionFields < 6) return 7;
    if (numberOfQuestionFields < 10) return 8;
    if (numberOfQuestionFields < 12) return 9;
    if (numberOfQuestionFields < 16) return 11;
    else return 9;
  }

  function getSpecialFieldsPlaces(
    numberOfBadSpecialFields: number,
    numberOfGoodSpecialFields: number,
    numberOfQuestionFields: number
  ) {
    const badFields: number[] = [];
    const goodFields: number[] = [];
    while (goodFields.length < numberOfGoodSpecialFields) {
      const randomIndex =
        Math.floor(Math.random() * (numberOfQuestionFields * 2)) + 1;
      if (randomIndex % 2 === 0 && !goodFields.includes(randomIndex)) {
        goodFields.push(randomIndex);
      }
    }
    while (badFields.length < numberOfBadSpecialFields) {
      const randomIndex =
        Math.floor(Math.random() * (numberOfQuestionFields * 2)) + 1;
      if (
        randomIndex % 2 === 0 &&
        !badFields.includes(randomIndex) &&
        !goodFields.includes(randomIndex)
      ) {
        badFields.push(randomIndex);
      }
    }
    return { badFields, goodFields };
  }

  const numberOfColumns = countNumberOfColumns(numberOfQuestionFields);
  const totalFields = 2 * numberOfQuestionFields + 2;
  const numberOfRows = Math.ceil(totalFields / numberOfColumns) + 2;

  useEffect(() => {
    const { badFields, goodFields } = getSpecialFieldsPlaces(
      numberOfBadSpecialFields,
      numberOfGoodSpecialFields,
      numberOfQuestionFields
    );
    setBadFields(badFields);
    setGoodFields(goodFields);
  }, []);

  const getBoardFieldSpecialty = (
    index: number,
    badFields: number[],
    goodFields: number[]
  ): BoardFieldSpecialty => {
    if (index === totalFields - 1) return "start";
    if (goodFields.includes(index)) return "good";
    if (badFields.includes(index)) return "bad";
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
        type: getBoardFieldSpecialty(index, badFields, goodFields),
      });
      return {
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index, badFields, goodFields),
      };
    }
    if (upOrDown === "down") {
      rowClass = currentRow;
      if (index === target - 1) {
        gridPositions.push({
          index,
          colClass,
          rowClass,
          type: getBoardFieldSpecialty(index, badFields, goodFields),
        });
        return {
          colClass,
          rowClass,
          type: getBoardFieldSpecialty(index, badFields, goodFields),
        };
      }
      currentRow--;
      gridPositions.push({
        index,
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index, badFields, goodFields),
      });
      return {
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index, badFields, goodFields),
      };
    }
    rowClass = currentRow;
    if (index === target - 1) {
      gridPositions.push({
        index,
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index, badFields, goodFields),
      });
      return {
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index, badFields, goodFields),
      };
    }
    currentRow++;
    gridPositions.push({
      index,
      colClass,
      rowClass,
      type: getBoardFieldSpecialty(index, badFields, goodFields),
    });
    return {
      colClass,
      rowClass,
      type: getBoardFieldSpecialty(index, badFields, goodFields),
    };
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
      {Array.from({ length: totalFields - 1 }, (_, index) => {
        const {
          colClass: col,
          rowClass: row,
          type,
        } = getGridPosition(index + 1, numberOfColumns);
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
