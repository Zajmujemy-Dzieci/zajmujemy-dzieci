import { useState } from "react";
import { GameBoardComponent } from "./GameBoardComponent";

type Player = {
  orderId: number;
  nick: string;
  score: number;
  position: number;
};

export type GameBoardConfiguration = {
  numberOfQuestionFields: number;
  numberOfGoodSpecialFields: number;
  numberOfBadSpecialFields: number;
};

function setNextPlayer(currentPlayer: Player, players: Player[]) {
  const nextPlayerIndex =
    currentPlayer.orderId === players.length - 1
      ? currentPlayer.orderId + 1
      : 0;
  return players[nextPlayerIndex];
}

export default function GameBoard(
  players: Player[],
  configuration: GameBoardConfiguration
) {
  if (!players) {
    return <div>Nie ma z kim grać...</div>;
  }

  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[0]);

  return (
    <div className="w-[100vw] h-[100vh] p-32">
      <GameBoardComponent {...configuration} />
    </div>
  );
}
