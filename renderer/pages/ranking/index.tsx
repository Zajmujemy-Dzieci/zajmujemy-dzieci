import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAtom } from "jotai";
import { playersQueueAtom } from "../../models/PlayersQueueAtom";
import { Player } from "../../types/Player";

export default function RankingPage() {
  const [players, setPlayers] = useAtom<Player[]>(playersQueueAtom);

  const sortedPlayers: Player[] = players.slice().sort((a, b) => {
    if (b.score === a.score) {
      return a.nick.localeCompare(b.nick); // Sortowanie alfabetyczne, jeśli punkty są równe
    }
    return b.score - a.score;
  });

  const playersTable: JSX.Element[] = [];

  const emojis = ['🥇', '🥈', '🥉'];

  let currentPlayerIndex = 0;
  while (currentPlayerIndex < sortedPlayers.length) {
    const currentScore = sortedPlayers[currentPlayerIndex].score;
    let playersWithSameScore = [sortedPlayers[currentPlayerIndex].nick];
    let nextPlayerIndex = currentPlayerIndex + 1;
    while (nextPlayerIndex < sortedPlayers.length && sortedPlayers[nextPlayerIndex].score === currentScore) {
      playersWithSameScore.push(sortedPlayers[nextPlayerIndex].nick);
      nextPlayerIndex++;
    }
    const placeEmoji = emojis[Math.min(currentPlayerIndex, 2)] || ''; // Wybierz emotkę w zależności od miejsca

    const playersString = playersWithSameScore.join(', ');
    playersTable.push(
      <div className="flex justify-center items-center text-3xl" key={currentPlayerIndex}>
        <span>{placeEmoji} {playersString} - {currentScore}</span>
      </div>
    );

    currentPlayerIndex = nextPlayerIndex;
  }

  return (
    <React.Fragment>
      <Head>
        <title>Ranking - Nextron (z-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 p-5 text-2xl w-full text-center">
        <h1 className="text-4xl font-bold">Ranking graczy</h1>
        <div className="mt-5 text-8xl">
          {playersTable}
        </div>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/loader">
          <a className="btn-blue">Rozpocznij przygodę od nowa!</a>
        </Link>
      </div>
    </React.Fragment>
  );
}