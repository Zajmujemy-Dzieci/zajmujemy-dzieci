import React, { useState, useEffect } from 'react';
import { useSetWebSocket, useClearWebSocket } from '../../models/WebsocketAtom';

const WebSocketPage: React.FC = () => {
    const [serverAddress, setServerAddress] = useState<string>('192.168.137.1');
    const [status, setStatus] = useState<string>('');
    const setWebSocket = useSetWebSocket();
    const clearWebSocket = useClearWebSocket();

    const connectToWebSocket = () => {
        if (!serverAddress) {
            setStatus('Please enter server address');
            return;
        }

        const ws = new WebSocket(`ws://${serverAddress}:3000/ws`);

        ws.onopen = () => {
            setStatus('Connected to WebSocket server');
            ws.send(JSON.stringify({ type: 'register', nick: "host" }));
            console.log("sent host address");
            setWebSocket(ws);
        };

        ws.onmessage = (msg) => {
            const parsed = JSON.parse(msg.data);

            if (parsed.type === 'ping') {
                const from = parsed.from;
                ws.send(JSON.stringify({ type: "pong", destination: from }));
                sendDicePermission("test0", ws)
                sendQuestion("pytanie testowe", ["tak","nie","może"], "test0", ws)
            }

            if (parsed.type === 'answer') {
                const from = parsed.from;
                ws.send(JSON.stringify({ type: "ACK", destination: from, text: "Received answer "
                        + parsed.answer + " from player " + from }));
            }

            if (parsed.type === 'dice') {
                const from = parsed.from;
                ws.send(JSON.stringify({ type: "ACK", destination: from, text: "Received dice "
                        + parsed.dice + " from player " + from }));
            }
        };

        ws.onerror = (error) => {
            setStatus('WebSocket error: ' + error);
        };

        ws.onclose = () => {
            setStatus('WebSocket connection closed');
            clearWebSocket();
        };
    };

    const sendQuestion = (content: string, answers: string[], nick: string, ws: WebSocket) => {
        if (!serverAddress) {
            setStatus('Please connect to WebSocket first');
            return;
        }

        ws.send(JSON.stringify({ type: "question", destination: nick, content: content, answers: answers }));
    };

    const sendDicePermission = (nick: string, ws: WebSocket) => {
        if (!serverAddress) {
            setStatus('Please connect to WebSocket first');
            return;
        }

        ws.send(JSON.stringify({ type: "throwDice", destination: nick }));
    };

    useEffect(() => {
        connectToWebSocket();

        return () => {
            console.log('WebSocket connection cleanup');
        };
    }, [serverAddress]);

    return (
        <div>
            <h1>WebSocket Page</h1>
            <div>Status: {status}</div>
        </div>
    );
};

export default WebSocketPage;
