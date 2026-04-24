import type { InputHandler } from "./engine";
import type { BikeModel } from "./bike-model";

/**
 * Strategy pattern for bike movement.
 *
 * A MovementStrategy decides where the bike should be each frame.
 * Swap implementations to change how the bike is controlled:
 * mouse, keyboard, gamepad, AI autopilot, replay playback, etc.
 *
 * BikeEntity calls update() once per frame before BikeModel.update(),
 * so the model's tilt smoothing always runs after the position is set.
 */
export interface MovementStrategy {
  update(model: BikeModel, deltaTime: number): void;
}

/**
 * Tracks cursor position and drives the bike to follow it.
 * Also implements InputHandler so it can be attached/detached by the engine.
 */
export class MouseMovementStrategy implements MovementStrategy, InputHandler {
  private readonly canvas: HTMLCanvasElement;
  private mouseRatio = 0.5; // default: centre of the road

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  attach(): void {
    this.canvas.addEventListener("mousemove", this.onMouseMove);
  }

  detach(): void {
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseRatio = (event.clientX - rect.left) / this.canvas.width;
  };

  update(model: BikeModel, _deltaTime: number): void {
    model.setDesiredRatio(this.mouseRatio, this.canvas.width);
  }
}
