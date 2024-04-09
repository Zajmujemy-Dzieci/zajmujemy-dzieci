import { useEffect, useState } from "react";
import GameBoardComponent from "./GameBoardComponent";
import Link from "next/link";
import { useAtom } from "jotai";
import { Player } from "../../types/Player";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { gameBoardConfigurationAtom } from "../../models/GameConfigAtom";
import { playersQueueAtom } from "../../models/PlayersQueueAtom";
import { QuestionList } from "../../models/QuestionList";

export default function GameBoard() {
  // Getting question from questionList: const question = questionList.getQuestion();
  const questionList = QuestionList.getInstance();
  const [playersQueue, setPlayersQueue] = useAtom<Player[]>(playersQueueAtom);
  
  const [configuration, setConfiguration] = useAtom<GameBoardConfiguration>(
    gameBoardConfigurationAtom
  );

  useEffect(() => {
    console.log("Players queue: ", playersQueue);
    console.log("Configuration: ", configuration);
  }, [playersQueue, configuration]);

  return (
    <div className="w-[100vw] h-[100vh] p-32">
      <Link href="/ranking">
        <a className="btn-blue absolute top-0 right-0 m-5">Zakończ grę</a>
      </Link>
      <GameBoardComponent configuration={configuration} players={playersQueueQueue} />
    </div>
  );
}
