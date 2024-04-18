import { twMerge } from "tailwind-merge";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { Player } from "../../types/Player";
import GameBoardPawn from "./GameBoardPawn";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { webSocketAtom } from "../../models/WebSocketAtom";
import SpecialPopupComponent from "./SpecialPopupComponent";
import QuestionPopup from "./QuestionPopup";
import GameOverPopup from "./GameOverPopup";
import CountdownClock from "../../pages/gameboard/CountdownClock";

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
  const [ws, setWs] = useAtom(webSocketAtom);
  const [goodFields, setGoodFields] = useState<number[]>([]);
  const [badFields, setBadFields] = useState<number[]>([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [isGameOverPopupOpen, setGameOverPopupOpen] = useState(false);
  const [gridPositions, setGridPositions] = useState<BoardField[]>([]);
  const [numberOfColumns] = useState(
    countNumberOfColumns(configuration.numberOfQuestionFields)
  );
  const [totalFields] = useState(2 * configuration.numberOfQuestionFields + 2);
  const [numberOfRows] = useState(Math.ceil(totalFields / numberOfColumns) + 2);
  const [isClockOpen, setClockOpen] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState(0);

  useEffect(() => {
    const { tmpBadFields, tmpGoodFields } = getSpecialFieldsPlaces(
      configuration.numberOfBadSpecialFields,
      configuration.numberOfGoodSpecialFields,
      configuration.numberOfQuestionFields
    );
    setBadFields(tmpBadFields);
    setGoodFields(tmpGoodFields);
    setGridPositions([
      { index: 1, colClass: 1, rowClass: 1, type: "start" },
      ...createBoard(numberOfRows, totalFields, tmpGoodFields, tmpBadFields),
    ]);
  }, []);

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
    const tmpBadFields: number[] = [];
    const tmpGoodFields: number[] = [];
    while (tmpGoodFields.length < numberOfGoodSpecialFields) {
      const randomIndex =
        Math.floor(Math.random() * (numberOfQuestionFields * 2)) + 1;
      if (randomIndex % 2 === 0 && !tmpGoodFields.includes(randomIndex)) {
        tmpGoodFields.push(randomIndex);
      }
    }
    while (tmpBadFields.length < numberOfBadSpecialFields) {
      const randomIndex =
        Math.floor(Math.random() * (numberOfQuestionFields * 2)) + 1;
      if (
        randomIndex % 2 === 0 &&
        !tmpBadFields.includes(randomIndex) &&
        !tmpGoodFields.includes(randomIndex)
      ) {
        tmpBadFields.push(randomIndex);
      }
    }
    return { tmpBadFields, tmpGoodFields };
  }

  const getBoardFieldSpecialty = (
    index: number,
    newGoodFields: number[],
    newBadFields: number[]
  ): BoardFieldSpecialty => {
    if (index === totalFields - 1) return "start";
    if (newGoodFields.includes(index)) return "good";
    if (newBadFields.includes(index)) return "bad";
    return index % 2 === 0 ? "empty" : "question";
  };

  function createBoard(
    numberOfRows: number,
    totalFields: number,
    newGoodFields: number[],
    newBadFields: number[]
  ) {
    const fields: BoardField[] = [];
    let currentColumn = 1;
    let currentRow = 2;
    let target = numberOfRows;
    let upOrDown = "up";
    let colClass = currentColumn;
    let rowClass = currentRow;

    const getGridPosition = (index: number) => {
      colClass = currentColumn;
      rowClass = currentRow;
      if (index === target) {
        currentColumn++;
        colClass = currentColumn;
        currentColumn++;
        target += numberOfRows;
        if (upOrDown === "up") upOrDown = "down";
        else upOrDown = "up";
        return {
          index,
          colClass,
          rowClass,
          type: getBoardFieldSpecialty(index, newGoodFields, newBadFields),
        };
      }
      if (upOrDown === "down") {
        rowClass = currentRow;
        if (index === target - 1) {
          return {
            index,
            colClass,
            rowClass,
            type: getBoardFieldSpecialty(index, newGoodFields, newBadFields),
          };
        }
        currentRow--;
        return {
          index,
          colClass,
          rowClass,
          type: getBoardFieldSpecialty(index, newGoodFields, newBadFields),
        };
      }
      rowClass = currentRow;
      if (index === target - 1) {
        return {
          index,
          colClass,
          rowClass,
          type: getBoardFieldSpecialty(index, newGoodFields, newBadFields),
        };
      }
      currentRow++;
      return {
        index,
        colClass,
        rowClass,
        type: getBoardFieldSpecialty(index, newGoodFields, newBadFields),
      };
    };

    Array.from({ length: totalFields - 1 }, (_, index) => {
      fields.push(getGridPosition(index + 1));
    });
    return fields;
  }

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

  async function handleShowGameOverPopup() {
    return new Promise<void>(() => {
      setGameOverPopupOpen(true);
    });
  }
  if (!players) {
    return <div>Nie ma z kim grać...</div>;
  }
  if (!configuration) {
    return <div>Brak konfiguracji planszy...</div>;
  }

  async function openClock(timeInSeconds: number) {
    setClockOpen(false);
    setTimeout(() => {
      setTimeInSeconds(timeInSeconds);
      setClockOpen(true);
    }, 0);
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

      {isGameOverPopupOpen && (
        <div>
          <GameOverPopup
            isOpen={isGameOverPopupOpen}
            onClose={() => setGameOverPopupOpen(false)}
          />
        </div>
      )}

      {isClockOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2">
          <CountdownClock
            timeoutInSeconds={timeInSeconds}
            onTimeout={() => setClockOpen(false)}
          />
        </div>
      )}

      <QuestionPopup />

      <div
        style={{ gridRow: 1, gridColumn: 1 }}
        className="bg-childBlack h-28 w-28"
      >
        START
      </div>
      {gridPositions.length > 0 &&
        gridPositions.map(({ index, type, colClass, rowClass }, i) => {
          return (
            <div
              key={i + index}
              style={{
                gridColumn: colClass,
                gridRow: rowClass,
              }}
              className={twMerge(
                mapTypeOnColor(type),
                "h-28 w-28 flex flex-wrap justify-center content-center items-center p-3"
              )}
            ></div>
          );
        })}
      {gridPositions.length > 1 &&
        players.map((player, i) => (
          <GameBoardPawn
            player={player}
            shift={{
              x: (i % 3) * 33,
              y: Math.floor((Math.floor(i / 3) * 100 * 3) / players.length),
            }}
            boardFields={gridPositions}
            handleOpenSpecialPopup={handleOpenSpecialPopup}
            showGameOverPopup={handleShowGameOverPopup}
            openClock={openClock}
          />
        ))}
    </div>
  );
}
