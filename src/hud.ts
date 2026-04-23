import type { GameState } from "./state";

export class Hud {
  private readonly scoreElement: HTMLSpanElement;
  private readonly healthElement: HTMLSpanElement;

  constructor(scoreElement: HTMLSpanElement, healthElement: HTMLSpanElement) {
    this.scoreElement = scoreElement;
    this.healthElement = healthElement;
  }

  render(state: GameState): void {
    this.scoreElement.textContent = `Score: ${state.score}`;
    this.healthElement.textContent = `Health: ${state.health}`;
  }
}
