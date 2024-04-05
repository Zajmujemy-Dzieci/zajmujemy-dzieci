//trzeba ropocząć grę aby połączyć sie z serwerem

import React, { useState, useEffect } from "react";
import { webSocketAtom } from "../../models/WebsocketAtom";
import { useAtom } from "jotai/index";

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

    ws!.onmessage = (msg) => {
      const parsed = JSON.parse(msg.data);

      if (parsed.type === "ping") {
        const from = parsed.from;
        ws?.send(JSON.stringify({ type: "pong", destination: from }));
        sendDicePermission("Gracz 0");
        sendQuestion("pytanie testowe", ["tak", "nie", "może"], "Gracz 0");
      }

      if (parsed.type === "answer") {
        const from = parsed.from;
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
        ws?.send(
          JSON.stringify({
            type: "ACK",
            destination: from,
            text: "Received dice " + parsed.dice + " from player " + from,
          })
        );
      }
    };

    ws!.onerror = (error) => {
      setStatus("WebSocket error: " + error);
    };

    ws!.onclose = () => {
      setStatus("WebSocket connection closed");
      setWebSocket(null);
    };
  };

  const sendQuestion = (content: string, answers: string[], nick: string) => {
    if (!serverAddress || !ws) {
      setStatus("Please connect to WebSocket first");
      return;
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

  const sendDicePermission = (nick: string) => {
    if (!serverAddress || !ws) {
      setStatus("Please connect to WebSocket first");
      return;
    }

    ws.send(JSON.stringify({ type: "throwDice", destination: nick }));
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
