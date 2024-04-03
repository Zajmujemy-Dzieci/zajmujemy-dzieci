import { atom, useAtom } from 'jotai';

interface WebSocketState {
    ws: WebSocket | null;
}

export const webSocketAtom = atom<WebSocketState>({
    ws: null,
});

export const useSetWebSocket = () => {
    const [, updateWebSocket] = useAtom(webSocketAtom);

    return (ws: WebSocket) => {
        updateWebSocket((prev: WebSocketState) => ({ ...prev, ws }));
    };
};

export const useClearWebSocket = () => {
    const [, updateWebSocket] = useAtom(webSocketAtom);

    return () => {
        updateWebSocket((prev: WebSocketState) => ({ ...prev, ws: null }));
    };
};
