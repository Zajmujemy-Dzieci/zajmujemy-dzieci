//trzeba ropocząć grę aby połączyć sie z serwerem

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { webSocketAtom } from "../../models/WebsocketAtom";
import { useAtom } from "jotai/index";
import { DiceThrowMessage } from "../../types/MessageTypes";
import { ClientMessage } from "../../types/MessageTypes";

export const sendDicePermission = (nick: string, ws: WebSocket) => {
  if (!ws) {
    throw new Error("Brak połączenia z serwerem");
  }

  ws.send(JSON.stringify({ type: "throwDice", destination: nick }));
};

export const sendQuestion = (
  ws: WebSocket,
  content: string,
  answers: string[],
  nick: string
) => {
  if (!ws) {
    throw new Error("Brak połączenia z serwerem");
  }

  ws.send(
    JSON.stringify({
      type: "question",
      destination: nick,
      content: content,
      answers: answers,
    })
  );
};

export function listenOnSocket(
  ws: WebSocket,
  movePawn: (fieldsToMove: number) => void,
  showAnswer: (answer: string) => void
) {
  ws!.onmessage = (msg: MessageEvent<any>) => {
    const parsed = JSON.parse(msg.data);

    // if (parsed.type === "ping") {
    //   const from = parsed.from;
    //   ws?.send(JSON.stringify({ type: "pong", destination: from }));
    //   // sendDicePermission("Gracz 0");
    //   sendQuestion("pytanie testowe", ["tak", "nie", "może"], "Gracz 0");
    // }

    if (parsed.type === "answer") {
      const from = parsed.from;
      showAnswer(parsed.answer);
      ws?.send(
        JSON.stringify({
          type: "ACK",
          destination: from,
          text: "Received answer " + parsed.answer + " from player " + from,
        })
      );
    }

    if (parsed.type === "dice") {
      const from = parsed.from;
      movePawn(parsed.dice);
      ws?.send(
        JSON.stringify({
          type: "ACK",
          destination: from,
          text: "Received dice " + parsed.dice + " from player " + from,
        })
      );
    }
  };
}

const WebSocketPage: React.FC = () => {
  const [serverAddress, setServerAddress] = useState<string>("192.168.137.1");
  const [status, setStatus] = useState("");
  // const setWebSocket = useSetWebSocket();
  // const clearWebSocket = useClearWebSocket();
  // let ws: WebSocket | null = null;
  const [ws, setWebSocket] = useAtom(webSocketAtom);

  const connectToWebSocket = () => {
    if (!serverAddress) {
      setStatus("Please enter server address");
      return;
    }

    setWebSocket(new WebSocket(`ws://${serverAddress}:3000/ws`));

    ws!.onopen = () => {
      setStatus("Connected to WebSocket server");
      ws?.send(JSON.stringify({ type: "register", nick: "host" }));
      console.log("sent host address");
      if (ws != null) setWebSocket(ws);
    };

    ws!.onerror = (error) => {
      setStatus("WebSocket error: " + error);
    };

    ws!.onclose = () => {
      setStatus("WebSocket connection closed");
      setWebSocket(null);
    };
  };

  useEffect(() => {
    connectToWebSocket();

    return () => {
      console.log("WebSocket connection cleanup");
      if (ws) {
        ws.close();
      }
      setWebSocket(null);
    };
  }, [serverAddress]);

  return <div></div>;
};

export default WebSocketPage;
