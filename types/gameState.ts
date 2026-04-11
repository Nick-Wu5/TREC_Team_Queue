export interface GameState {
  id: number;
  timer: number;
  game_active: boolean;
  game_ended: boolean;
}

export type UpdateGameStatePayload = Partial<
  Pick<GameState, "timer" | "game_active" | "game_ended">
>;

