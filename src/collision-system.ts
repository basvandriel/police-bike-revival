import type { Updatable } from "./engine";
import type { BikeModel } from "./bike-model";
import type { RoadWorld } from "./road-world";
import { EventEmitter } from "./event-emitter";
import { BIKE_WIDTH, CANVAS_WIDTH, OBSTACLE_MAX_Z } from "./constants";
import { ROAD_WIDTH } from "./background-view";

export interface CollisionEvents {
  hit: { obstacleId: string };
}

// The bike sits at the front of the road and is roughly 1 world unit wide.
const BIKE_WORLD_HALF = 0.45;
const BIKE_COLLIDE_Z = 0.85;

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
    const bikeWorldX = (bikeCenter / CANVAS_WIDTH - 0.5) * ROAD_WIDTH;

    for (const obstacle of this.obstacleModel.activeObstacles) {
      const { id, worldZ, xFrac, widthFrac } = obstacle;

      // Obstacle has cycled back to the far end — reset cooldown for next approach
      if (worldZ > OBSTACLE_MAX_Z * 0.8) {
        this.hitCooldown.delete(id);
      }

      if (worldZ <= BIKE_COLLIDE_Z && !this.hitCooldown.has(id)) {
        const obstacleWorldX = xFrac * (ROAD_WIDTH / 2);
        const obstacleHalf = (widthFrac * ROAD_WIDTH) / 2;

        if (
          Math.abs(bikeWorldX - obstacleWorldX) <
          BIKE_WORLD_HALF + obstacleHalf
        ) {
          this.hitCooldown.add(id);
          this.emit("hit", { obstacleId: id });
        }
      }
    }
  }
}
