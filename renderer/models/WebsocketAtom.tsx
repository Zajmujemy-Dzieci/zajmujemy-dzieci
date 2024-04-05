import { atom, useAtom } from "jotai";

export type WebSocketState = WebSocket | null;

export const webSocketAtom = atom<WebSocketState>(null);

// export const useSetWebSocket = () => {
//     const [, updateWebSocket] = useAtom(webSocketAtom);

//     return (ws: WebSocket) => {
//         updateWebSocket((prev: WebSocketState) => ({ ...prev, ws }));
//     };
// };

// export const useClearWebSocket = () => {
//     const [, updateWebSocket] = useAtom(webSocketAtom);

//     return () => {
//         updateWebSocket((prev: WebSocketState) => ({ ...prev, ws: null }));
//     };
// };
