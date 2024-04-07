import { useState } from "react";
import GameBoardComponent from "./GameBoardComponent";
import Link from "next/link";
import { useAtom } from "jotai";
import { Player } from "../../types/Player";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { gameBoardConfigurationAtom } from "../../models/GameConfigAtom";
import { playersQueueAtom } from "../../models/PlayersQueueAtom";
import {Popup,loadQuestion,revealAnswer} from "./Popup";
import { Question } from "../../models/Question";

export default function GameBoard() {
  const [playersQueue, setPlayersQueue] = useAtom<Player[]>(playersQueueAtom);
  const players = [
    {
      orderId: 0,
      nick: "Gracz 1",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 1,
      nick: "Gracz 2",
      score: 0,
      background: "bg-blue-500",
    },
    {
      orderId: 2,
      nick: "Gracz 3",
      score: 0,
      background: "bg-blue-300",
    },
    {
      orderId: 3,
      nick: "Gracz 4",
      score: 0,
      background: "bg-blue-200",
    },
    {
      orderId: 4,
      nick: "Gracz 5",
      score: 0,
      background: "bg-blue-100",
    },
    {
      orderId: 5,
      nick: "Gracz 6",
      score: 0,
      background: "bg-blue-600",
    },
  ];
  const [configuration, setConfiguration] = useAtom<GameBoardConfiguration>(
    gameBoardConfigurationAtom
  );


  //This is for testing purposes only. Remove it if i forgot to.
  const handleClick1 = () => {
    const sampleQuestion = new Question(
      "What is the capital of France?",
      ["Paris", "Berlin", "Madrid", "Rome"],
      0 // Index of the correct answer (Paris)
    );
    
    loadQuestion(sampleQuestion);
  }

  const handleClick2 = () => {
    revealAnswer(2);
  }

  return (    
    <div className="w-[100vw] h-[100vh] p-32">      
      <Popup/>
      <Link href="/ranking">
        <a className="btn-blue absolute top-0 right-0 m-5">Zakończ grę</a>
      </Link>
      <GameBoardComponent configuration={configuration} players={players} />
      <button className="btn-blue absolute left-20" onClick={handleClick1}>Zaladuj</button>
      <button className="btn-blue absolute left-0" onClick={handleClick2}>Pokaz</button>
    </div>
  );
}
