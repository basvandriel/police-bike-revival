import { BIKE_HEIGHT, BIKE_WIDTH } from "./constants";
import type { BikeModel } from "./bike-model";

export class BikeView {
  private readonly image = new Image();
  private loaded = false;
  private readonly model: BikeModel;

  constructor(imageUrl: string, model: BikeModel) {
    this.image.src = imageUrl;
    this.model = model;
  }

  get width(): number {
    return BIKE_WIDTH;
  }

  get height(): number {
    return BIKE_HEIGHT;
  }

  load(): Promise<void> {
    return new Promise((resolve) => {
      if (this.image.complete) {
        this.loaded = true;
        resolve();
        return;
      }

      this.image.onload = () => {
        this.loaded = true;
        resolve();
      };
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.loaded) {
      return;
    }

    const { x, y, tilt } = this.model.state;
    const centerX = x + BIKE_WIDTH / 2;
    const centerY = y + BIKE_HEIGHT / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(tilt);
    ctx.drawImage(
      this.image,
      -BIKE_WIDTH / 2,
      -BIKE_HEIGHT / 2,
      BIKE_WIDTH,
      BIKE_HEIGHT,
    );
    ctx.restore();
  }
}
