import { twMerge } from "tailwind-merge";
import { GameBoardConfiguration, Player } from ".";

type BoardFieldSpecialty =
  | "question"
  | "good"
  | "bad"
  | "finish"
  | "start"
  | "empty";

type BoardField = {
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
  }
}

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

export function GameBoardComponent({
  configuration: {
    numberOfQuestionFields = 15,
    numberOfGoodSpecialFields = 3,
    numberOfBadSpecialFields = 3,
  },
  players,
}: {
  configuration: GameBoardConfiguration;
  players: Player[];
}) {
  const numberOfColumns = Math.floor((numberOfQuestionFields * 2) / 3) - 1;
  const totalFields = 2 * numberOfQuestionFields + 2;

  const getBoardFieldSpecialty = (index: number): BoardFieldSpecialty => {
    if (
      index % (numberOfBadSpecialFields + numberOfGoodSpecialFields - 1) ===
      0
    )
      return "good";
    return index % 2 === 0 ? "question" : "empty"; // Special or question
  };

  let currentColumn = 1;
  let currentRow = 2;
  let target = numberOfColumns - 2;
  let upOrDown = "up";
  let colClass = currentColumn;
  let rowClass = currentRow;

  const gridPositions: {
    index: number;
    colClass: number;
    rowClass: number;
    type: BoardFieldSpecialty;
  }[] = [];
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

  console.log(gridPositions);

  return (
    <div className={`w-full h-full grid gap-4`}>
      <div className="bg-childBlack row-start-1">1</div>
      {Array.from({ length: totalFields - 3 }, (_, index) => {
        const {
          colClass: col,
          rowClass: row,
          type,
        } = getGridPosition(index + 2, numberOfColumns);
        return (
          <div
            key={index}
            style={{
              gridColumnStart: col,
              gridRowStart: row,
            }}
            className={twMerge(
              mapTypeOnColor(type),
              "h-32 w-32 flex flex-wrap justify-center content-center items-center p-3"
            )}
          >
            {players[0].position === index && (
              <div className="m-0.5 bg-gray-800 w-8 h-8 rounded-full" />
            )}

            {players[1].position === index && (
              <div className="m-0.5 bg-gray-600 w-8 h-8 rounded-full" />
            )}
            {players[2].position === index && (
              <div className="m-0.5 bg-gray-400 w-8 h-8 rounded-full" />
            )}
            {players[3].position === index && (
              <div className="m-0.5 bg-blue-400 w-8 h-8 rounded-full" />
            )}
            {players[4].position === index && (
              <div className="m-0.5 bg-blue-600 w-8 h-8 rounded-full" />
            )}
            {players[5].position === index && (
              <div className="m-0.5 bg-blue-800 w-8 h-8 rounded-full" />
            )}
          </div>
        );
      })}
      {gridPositions.push({
        index: totalFields + 1,
        colClass: 9,
        rowClass: 7,
        type: "finish",
      })}
      <button
        className={`bg-childBlack col-start-9 row-start-7`}
        onClick={(event) => {
          event.preventDefault();
          changePosition(players, players[0], players[0].position + 2);
        }}
      >
        1
      </button>
    </div>
  );
}
