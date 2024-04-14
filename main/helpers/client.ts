import { HostMessage, ServerMessage } from "./messages";

export default class Client {
    ws: WebSocket;
    nick: string;
    lastKeepAlive: number = Date.now();
    timer: NodeJS.Timeout | null = null;

    checks: Array<(alive: boolean) => void> = [];

    constructor(ws: WebSocket, nick: string) {
        this.ws = ws;
        this.nick = nick;
    }

    send(msg: ServerMessage) {
        this.ws.send(JSON.stringify(msg));
    }

    sendHost(msg: HostMessage) {
        this.ws.send(JSON.stringify(msg));
    }

    isOnline(callback: (alive: boolean) => void) {
        this.checks.push(callback);
        this.ws.send(JSON.stringify({ type: "ping" }));

        this.timer = setTimeout(() => {
            console.log("Timeout for", this.nick);
            this.checks.forEach((check) => check(false));
            this.checks = [];
            this.ws.close();
        }, 5000);
    }

    handlePong() {
        console.log("Pong from", this.nick);
        this.checks.forEach((check) => check(true));
        this.checks = [];

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}