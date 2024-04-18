export type Player = {
  orderId: number;
  nick: string;
  score: number;
  background: string;
  iconName: string;
};

export type PlayersQueue = {
  players: Player[];
};
