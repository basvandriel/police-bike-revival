import type { GameState } from "./state";
import type { InputHandler } from "./engine";
import type { Hud } from "./hud";
import type { Scene } from "./scene";

export class Game {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly hud: Hud;
  private readonly scene: Scene;
  private readonly inputs: InputHandler[];
  private readonly state: GameState = {
    score: 50,
    health: 50,
  };
  private lastTime = 0;

  constructor(
    canvas: HTMLCanvasElement,
    hud: Hud,
    scene: Scene,
    inputs: InputHandler[],
  ) {
    this.canvas = canvas;
    this.hud = hud;
    this.scene = scene;
    this.inputs = inputs;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = 800;
    this.canvas.height = 600;
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
    this.ctx.fillStyle = "#1f2937";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.scene.draw(this.ctx);
  }

  private loop(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();
    requestAnimationFrame((time) => this.loop(time));
  }
}
