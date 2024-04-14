import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import QRCode from "qrcode.react";
import axios, { AxiosResponse } from "axios";
import { useAtom } from "jotai";
import { Player } from "../../types/Player";
import { playersQueueAtom } from "../../models/PlayersQueueAtom";
import { webSocketAtom } from "../../models/WebSocketAtom";

export default function QRcodePage() {
  const [ipAddress, setIPAddress] = useState<string>("192.168.137.1");
  const [players, setPlayers] = useAtom(playersQueueAtom);
  const [ws, setWs] = useAtom(webSocketAtom);

  function handleConnectToServer(response: AxiosResponse) {
    setIPAddress(response.data);
    const newWs = new WebSocket(`ws://${response.data}:3000/ws`);
    setWs(newWs);
    if (newWs) {
      newWs.onopen = async () => {
        console.log("Connected to server");
        newWs.send(JSON.stringify({ type: "register", nick: "host" }));
      };
      newWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "newPlayer" && data.nick) {
          addPlayer(data.nick);
          console.log("Nowy gracz: ", data.nick);
        }
      };
    }
  }

  const p = [
    // for debugging purposes
    {
      orderId: 0,
      nick: "gracz1",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 1,
      nick: "gracz2",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 2,
      nick: "gracz3",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 3,
      nick: "gracz4",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 4,
      nick: "gracz5",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 5,
      nick: "gracz6",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 6,
      nick: "gracz7",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 7,
      nick: "gracz8",
      score: 0,
      background: "bg-blue-400",
    },
    {
      orderId: 8,
      nick: "gracz9",
      score: 0,
      background: "bg-blue-400",
    },
  ];

  useEffect(() => {
    setPlayers([]); // setPlayers(p); for debugging purposes
    axios
      .get<string>("http://localhost:3000/ipaddress")
      .then((response) => handleConnectToServer(response))
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
      });
  }, []);

  const addPlayer = (nick: string) => {
    setPlayers((prevPlayers) => {
      console.log("Dodaję gracza: ", nick);
      const newPlayer: Player = {
        orderId: 0,
        nick: nick,
        score: 0,
        // TODO: randomize background
        background: "bg-blue-400",
      };
      const updatedPlayers = [...prevPlayers, newPlayer];
      console.log("Gracze: ", updatedPlayers);
      return updatedPlayers;
    });
  };

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
    console.log(players);
    const playersWithOrderIds = assignOrderIds(players);
    setPlayers(playersWithOrderIds);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Join do game!</title>
      </Head>
      <div className="text-3xl absolute m-5 top-0">
        Gracze:
        {players.map((player) => (
          <div key={player.nick} className="text-2xl">
            {player.nick}
          </div>
        ))}
      </div>
      <div className="flex justify-center text-4xl flex-col items-center m-10">
        <p>Adres do połączenia się: http://{ipAddress}:3000</p>
        <div className="m-10">
          <QRCode value={`http://${ipAddress}:3000`} className="m-10" size={400} />
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
