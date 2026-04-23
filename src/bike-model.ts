import { BIKE_WIDTH } from "./constants";
import type { Updatable } from "./engine";
import type { BikeState } from "./state";

const MAX_TILT = 0.45;
const TILT_SPEED = 5.0;
const TILT_RECOVER_DELAY = 0.25;

export class BikeModel implements Updatable {
  public readonly state: BikeState;

  constructor(initialX: number, initialY: number) {
    this.state = {
      x: initialX,
      y: initialY,
      tilt: 0,
      targetTilt: 0,
      lastMoveTime: 0,
    };
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

  setDesiredRatio(ratio: number, canvasWidth: number): void {
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const nextX = Math.max(
      0,
      Math.min(
        clampedRatio * canvasWidth - BIKE_WIDTH / 2,
        canvasWidth - BIKE_WIDTH,
      ),
    );

    this.setTargetX(nextX);
  }

  update(deltaTime: number): void {
    const now = performance.now();
    const active = now - this.state.lastMoveTime < TILT_RECOVER_DELAY * 1000;
    const target = active ? this.state.targetTilt : 0;

    const blend = Math.min(1, deltaTime * TILT_SPEED);
    this.state.tilt += (target - this.state.tilt) * blend;

    if (Math.abs(this.state.tilt) < 0.001) {
      this.state.tilt = 0;
    }
  }
}
