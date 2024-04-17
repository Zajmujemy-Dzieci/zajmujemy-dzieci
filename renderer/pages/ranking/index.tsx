import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { playersQueueAtom } from "../../models/PlayersQueueAtom";
import { Player } from "../../types/Player";
import Image from "next/image";
import styles from "./styles.module.scss";

function handleClose() {
  const ws = new WebSocket("ws://localhost:3000/ws");
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "reset" }));
  };
}

export default function RankingPage() {
  const players = useAtomValue<Player[]>(playersQueueAtom);

  function getThreeBestScores(players: Player[]) {
    return players
      .map((player) => player.score)
      .filter((score, index, self) => self.indexOf(score) === index)
      .sort((a, b) => b - a)
      .slice(0, 3);
  }

  const playersWithEndResults = players
    .sort((a, b) => {
      if (b.score === a.score) {
        return a.nick.localeCompare(b.nick);
      }
      return b.score - a.score;
    })
    .map((player) => {
      return {
        nick: player.nick,
        score: player.score,
        placeIcon: getThreeBestScores(players).indexOf(player.score),
      };
    });

  const emojis = ["🥇", "🥈", "🥉"];

  return (
    <React.Fragment>
      <Head>
        <title>Ranking</title>
      </Head>
      <div className="flex flex-col gap-4 justify-center items-center content-center p-8 w-full text-center">
        <div className="p-5">
          <Image
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
            width={128}
            height={128}
          />
        </div>
        <h1 className={styles.header}>Ranking graczy</h1>
        <div className="text-6xl p-5">
          {playersWithEndResults.map((player, index) => (
            <div
              key={player.nick}
              className="flex p-3 justify-center items-center"
            >
              <span
                className={
                  player.placeIcon !== -1 ? "text-childRed" : "text-childWhite"
                }
              >
                {emojis[player.placeIcon]} {player.nick} - {player.score}{" "}
                {emojis[player.placeIcon]}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 mt-5">
          <Link href="/loader">
            <a
              className="text-childWhite text-4xl font-bold py-2 px-4 rounded bg-childBlack border-solid border-childWhite border-2 mx-auto hover:bg-childWhite hover:text-childBlack"
              onClick={handleClose}
            >
              Rozpocznij od nowa!
            </a>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}
