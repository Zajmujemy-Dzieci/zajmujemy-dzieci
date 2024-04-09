import { atom } from "jotai";

type WebSocketState = WebSocket | null;

export const webSocketAtom = atom<WebSocketState>(null);
