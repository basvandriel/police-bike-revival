import type { BackgroundModel } from "./background-model";
import {
  OBSTACLE_MAX_Z,
  OBSTACLE_MIN_Z,
  OBSTACLE_SCROLL_FACTOR,
} from "./constants";

const OBSTACLE_CYCLE_Z = OBSTACLE_MAX_Z - OBSTACLE_MIN_Z;

export interface ObstacleDef {
  id: string;
  /** 0–1 phase offset so each obstacle is staggered through the scroll cycle */
  worldZPhase: number;
  /** -1 = left road edge, 0 = center, +1 = right road edge */
  xFrac: number;
  /** sprite width as a fraction of road-bottom width */
  widthFrac: number;
  /** sprite height / sprite width */
  aspect: number;
  color: string;
  label?: string;
}

export interface ActiveObstacle extends ObstacleDef {
  /** Current world-Z depth — small = close to camera, large = far away */
  worldZ: number;
}

export class RoadWorld {
  private readonly backgroundModel: BackgroundModel;
  readonly defs: ObstacleDef[] = [
    {
      id: "warning",
      worldZPhase: 0.0,
      xFrac: -0.5,
      widthFrac: 0.1,
      aspect: 1.8,
      color: "#f97316",
      label: "!",
    },
    {
      id: "person1",
      worldZPhase: 0.34,
      xFrac: 0.4,
      widthFrac: 0.12,
      aspect: 2.0,
      color: "#dc2626",
      label: "P",
    },
    {
      id: "person2",
      worldZPhase: 0.67,
      xFrac: -0.25,
      widthFrac: 0.1,
      aspect: 1.9,
      color: "#22c55e",
      label: "?",
    },
  ];

  constructor(backgroundModel: BackgroundModel) {
    this.backgroundModel = backgroundModel;
  }

  /**
   * Returns obstacles currently visible in the world, sorted far → near
   * so renderers can draw them back-to-front.
   */
  get activeObstacles(): ActiveObstacle[] {
    const scrollPos =
      (this.backgroundModel.scrollOffset * OBSTACLE_SCROLL_FACTOR) %
      OBSTACLE_CYCLE_Z;

    return this.defs
      .map((def) => {
        const phase =
          (scrollPos + def.worldZPhase * OBSTACLE_CYCLE_Z) % OBSTACLE_CYCLE_Z;
        const worldZ = OBSTACLE_MAX_Z - phase;
        return { ...def, worldZ };
      })
      .filter(
        ({ worldZ }) =>
          worldZ > OBSTACLE_MIN_Z + 0.1 && worldZ < OBSTACLE_MAX_Z - 0.1,
      )
      .sort((a, b) => b.worldZ - a.worldZ);
  }
}
