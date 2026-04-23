export interface GameState {
  score: number;
  health: number;
}

export interface BikeState {
  x: number;
  y: number;
  tilt: number;
  targetTilt: number;
  lastMoveTime: number;
}
