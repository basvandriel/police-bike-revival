import type { Updatable } from "./engine";
import type { BikeModel } from "./bike-model";
import type { RoadWorld } from "./road-world";
import { EventEmitter } from "./event-emitter";
import {
  BIKE_WIDTH,
  CANVAS_WIDTH,
  OBSTACLE_MAX_Z,
  ROAD_BOTTOM_WIDTH_FRAC,
} from "./constants";

export interface CollisionEvents {
  hit: { obstacleId: string };
}

// Precompute road geometry constants once — same values BackgroundView uses
const CENTER_X = CANVAS_WIDTH / 2;
const ROAD_BOTTOM_HALF = (CANVAS_WIDTH * ROAD_BOTTOM_WIDTH_FRAC) / 2;

// An obstacle triggers a hit when it crosses this world-Z threshold.
// At worldZ 1.5 → screenY ≈ 436 (108 + 492/1.5), which is inside the bike sprite.
const HIT_Z_THRESHOLD = 1.5;

export class CollisionSystem
  extends EventEmitter<CollisionEvents>
  implements Updatable
{
  private readonly bikeModel: BikeModel;
  private readonly obstacleModel: RoadWorld;
  /** Tracks which obstacle IDs have already fired this pass so we don't repeat */
  private readonly hitCooldown = new Set<string>();

  constructor(bikeModel: BikeModel, obstacleModel: RoadWorld) {
    super();
    this.bikeModel = bikeModel;
    this.obstacleModel = obstacleModel;
  }

  update(_deltaTime: number): void {
    const bikeCenter = this.bikeModel.state.x + BIKE_WIDTH / 2;
    // Slightly smaller than the full sprite width — fairer for the player
    const bikeHalf = BIKE_WIDTH * 0.35;

    for (const obstacle of this.obstacleModel.activeObstacles) {
      const { id, worldZ, xFrac, widthFrac } = obstacle;

      // Obstacle has cycled back to the far end — reset cooldown for next approach
      if (worldZ > OBSTACLE_MAX_Z * 0.8) {
        this.hitCooldown.delete(id);
      }

      if (worldZ <= HIT_Z_THRESHOLD && !this.hitCooldown.has(id)) {
        // Project obstacle screen X using the same perspective formula as the renderer:
        // screenX = centerX + xFrac * (roadBottomHalf / worldZ)
        const screenX = CENTER_X + (xFrac * ROAD_BOTTOM_HALF) / worldZ;
        const spriteHalf =
          (widthFrac * CANVAS_WIDTH * ROAD_BOTTOM_WIDTH_FRAC) / worldZ / 2;

        if (Math.abs(bikeCenter - screenX) < bikeHalf + spriteHalf) {
          this.hitCooldown.add(id);
          this.emit("hit", { obstacleId: id });
        }
      }
    }
  }
}
