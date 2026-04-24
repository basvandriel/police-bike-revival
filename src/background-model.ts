import type { Updatable } from "./engine";

export class BackgroundModel implements Updatable {
  private offset = 0;
  private readonly speed: number;

  constructor(speed = 180) {
    this.speed = speed;
  }

  get scrollOffset(): number {
    return this.offset;
  }

  update(deltaTime: number): void {
    // No modulo wrap — wrapping at an arbitrary value causes a visible
    // discontinuity in the obstacle and dash scroll positions.
    this.offset += this.speed * deltaTime;
  }
}
