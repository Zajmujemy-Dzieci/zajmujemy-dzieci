import React, { useState, useEffect } from "react";
import { webSocketAtom } from "../../models/WebsocketAtom";
import { useAtom } from "jotai/index";
import axios from 'axios';

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

    if (parsed.type === "answer") {
      const from = parsed.from;
      showAnswer(parsed.answer);
      ws!.send(
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
      ws!.send(
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
  const [serverAddress, setServerAddress] = useState("");
  const [status, setStatus] = useState("");
  const [ws, setWebSocket] = useAtom(webSocketAtom);

  useEffect(() => {
    axios.get('http://localhost:3000/ipaddress')
        .then(response => {
          setServerAddress(response.data);
        })
        .catch(error => {
          console.error('Błąd pobierania danych:', error);
        });
  }, []);

  const connectToWebSocket = () => {
    if (!serverAddress) {
      setStatus("Please wait while getting server address");
      return;
    }

    const newWs = new WebSocket(`ws://${serverAddress}:3000/ws`)
    setWebSocket(newWs);

    newWs!.onopen = () => {
      setStatus("Connected to WebSocket server");
      newWs!.send(JSON.stringify({ type: "register", nick: "host" }));
      console.log("sent host address");
      if (ws != null) setWebSocket(ws);
    };

    newWs!.onerror = (error) => {
      setStatus("WebSocket error: " + error);
    };

    newWs!.onclose = () => {
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
