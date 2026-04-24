import type { GameState } from "./state";
import type { InputHandler } from "./engine";
import type { Hud } from "./hud";
import type { Scene } from "./scene";
import type { ThreeSetup } from "./three-setup";

export class Game {
  private readonly hud: Hud;
  private readonly scene: Scene;
  private readonly threeSetup: ThreeSetup;
  private readonly inputs: InputHandler[];
  private readonly state: GameState = {
    score: 50,
    health: 50,
  };
  private lastTime = 0;

  constructor(
    hud: Hud,
    scene: Scene,
    threeSetup: ThreeSetup,
    inputs: InputHandler[],
  ) {
    this.hud = hud;
    this.scene = scene;
    this.threeSetup = threeSetup;
    this.inputs = inputs;
  }

  async init(): Promise<void> {
    await this.scene.load();
    this.hud.render(this.state);
    this.inputs.forEach((input) => input.attach());
    this.lastTime = performance.now();
  }

  start(): void {
    requestAnimationFrame((time) => this.loop(time));
  }

  private update(deltaTime: number): void {
    this.scene.update(deltaTime);
  }

  private draw(): void {
    this.scene.draw();
    this.threeSetup.render();
  }

  onObstacleHit(_obstacleId: string): void {
    this.state.health = Math.max(0, this.state.health - 10);
    this.hud.render(this.state);
  }

  private loop(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();
    requestAnimationFrame((time) => this.loop(time));
  }
}
