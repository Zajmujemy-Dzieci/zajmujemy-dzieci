export type Player = {
    orderId: number;
    nick: string;
    score: number;
    position: number;
}

export type PlayersQueue = {
    players: Player[]
}