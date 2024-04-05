import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import QRCode from "qrcode.react";
import axios from "axios";
import { useAtom } from "jotai";
import { Player } from "../../types/Player";
import { playersQueueAtom } from "../../models/PlayersQueueAtom";

export default function QRcodePage() {
  const [ipAddress, setIPAddress] = useState<string>("192.168.137.1");
  const [players, setPlayers] = useAtom<Player[]>(playersQueueAtom);

  

  useEffect(() => {
    setPlayers([]);
    axios
      .get<string>("http://localhost:3000/ipaddress")
      .then((response) => {
        setIPAddress(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
      });
  }, []);

  const addPlayer = (nick: string) => {
    const newPlayer: Player = {
      orderId: 0,
      nick: nick,
      score: 0,
      // TODO: randomize background
      background: "bg-blue-400",
    };
    setPlayers([...players, newPlayer]);
  };


  const p = [
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

  useEffect(() => {
    setPlayers(p);
  }, []);

  const assignOrderIds = (players: Player[]): Player[] => {
    const shuffledPlayers = [...players];
    const numPlayers = shuffledPlayers.length;

    for (let i = numPlayers - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [
        shuffledPlayers[j],
        shuffledPlayers[i],
      ];
    }

    shuffledPlayers.forEach((player, index) => {
      player.orderId = index;
    });
    shuffledPlayers.sort((a, b) => a.orderId - b.orderId);
    return shuffledPlayers;
  };

  const handleStartGame = () => {
    const playersWithOrderIds = assignOrderIds(players);
    setPlayers(playersWithOrderIds);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Join do game!</title>
      </Head>
      <div className="flex justify-center text-4xl flex-col items-center m-10">
        <p>Adres do połączenia się: {ipAddress}:3000</p>
        <div className="m-10">
          <QRCode value={`${ipAddress}:3000`} className="m-10" size={400} />
        </div>

        <Link href="/gameboard">
          <button className="btn-blue" onClick={handleStartGame}>
            Rozpocznij grę
          </button>
        </Link>
        <Link href="/hotspot_instruction_page">
          <a className="btn-blue m-5">Instrukcja włączenia hotspota</a>
        </Link>
        <Link href="/config_page">
          <a className="btn-blue m-5">Powrót do ustawień</a>
        </Link>
      </div>
    </React.Fragment>
  );
}
