import React, { useState } from "react";
import GameBoardComponent from "./GameBoardComponent";
import Link from 'next/link'
import { useAtom } from "jotai";
import { Player } from "../../types/Player";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { gameBoardConfigurationAtom } from "../../models/GameConfigAtom";
import WebSocketPage from '../websocket_connection'; // Import WebSocketPage component to connect host with server

// UNUSED PURPOSELY - preparing for future use

function setNextPlayer(currentPlayer: Player, players: Player[]) {
  const nextPlayerIndex =
    currentPlayer.orderId === players.length - 1
      ? currentPlayer.orderId + 1
      : 0;
  return players[nextPlayerIndex];
}

// COMMENTED PURPOSELY - preparing for future use

export default function GameBoard() {
  // players: Player[],
  // configuration: GameBoardConfiguration | undefined | null
  // if (!players) {
  //   return <div>Nie ma z kim grać...</div>;
  // }

  // const [currentPlayer, setCurrentPlayer] = useState<Player>(players[0]);
  const players = [
    { orderId: 0, nick: "Gracz 1", score: 0, position: 6 },
    { orderId: 1, nick: "Gracz 2", score: 0, position: 6 },
    { orderId: 2, nick: "Gracz 3", score: 0, position: 6 },
    { orderId: 3, nick: "Gracz 4", score: 0, position: 6 },
    { orderId: 4, nick: "Gracz 5", score: 0, position: 6 },
    { orderId: 5, nick: "Gracz 6", score: 0, position: 6 },
  ];
  const [ configuration, setConfiguration] = useAtom<GameBoardConfiguration>(gameBoardConfigurationAtom);

  return (
    <div className="w-[100vw] h-[100vh] p-32">
      <Link href="/ranking">
        <a className="btn-blue absolute top-0 right-0 m-5">Zakończ grę</a>
      </Link>   
      <GameBoardComponent configuration={configuration} players={players} />
      <WebSocketPage />

    </div>
  );
}
