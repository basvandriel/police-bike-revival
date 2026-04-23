import type { InputHandler } from "./engine";
import type { BikeModel } from "./bike-model";

export class BikeMouseController implements InputHandler {
  private readonly canvas: HTMLCanvasElement;
  private readonly bikeModel: BikeModel;

  constructor(canvas: HTMLCanvasElement, bikeModel: BikeModel) {
    this.canvas = canvas;
    this.bikeModel = bikeModel;
  }

  attach(): void {
    this.canvas.addEventListener("mousemove", this.onMouseMove);
  }

  detach(): void {
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const ratio = mouseX / this.canvas.width;

    this.bikeModel.setDesiredRatio(ratio, this.canvas.width);
  };
}
