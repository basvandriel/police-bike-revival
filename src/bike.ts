import { BIKE_HEIGHT, BIKE_WIDTH } from "./constants";
import type { BikeState } from "./state";

const MAX_TILT = 0.45;
const TILT_SPEED = 0.12;
const TILT_RECOVER_DELAY = 250;

export class Bike {
  public state: BikeState;

  private readonly image: HTMLImageElement;
  private loaded = false;

  constructor(image: HTMLImageElement, initialX: number, initialY: number) {
    this.image = image;
    this.state = {
      x: initialX,
      y: initialY,
      tilt: 0,
      targetTilt: 0,
      lastMoveTime: 0,
    };
  }

  get width() {
    return BIKE_WIDTH;
  }

  get height() {
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

  setTargetX(nextX: number): void {
    const deltaX = nextX - this.state.x;
    this.state.x = nextX;
    this.state.targetTilt = Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, deltaX * 0.06),
    );
    this.state.lastMoveTime = performance.now();
  }

  update(): void {
    const now = performance.now();
    const active = now - this.state.lastMoveTime < TILT_RECOVER_DELAY;
    const target = active ? this.state.targetTilt : 0;

    this.state.tilt += (target - this.state.tilt) * TILT_SPEED;
    if (Math.abs(this.state.tilt) < 0.001) {
      this.state.tilt = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.loaded) {
      return;
    }

    const centerX = this.state.x + BIKE_WIDTH / 2;
    const centerY = this.state.y + BIKE_HEIGHT / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.state.tilt);
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
