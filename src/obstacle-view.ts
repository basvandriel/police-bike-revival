import * as THREE from "three";
import type { Drawable, Loadable } from "./engine";
import type { RoadWorld, ObstacleDef } from "./road-world";
import type { ThreeSetup } from "./three-setup";
import { ROAD_WIDTH, ROAD_NEAR_OFFSET } from "./background-view";

// worldZ 1..20 → Three.js z: -WORLD_Z_SCALE..-20*WORLD_Z_SCALE
const WORLD_Z_SCALE = 3;

interface ObstacleMesh {
  def: ObstacleDef;
  mesh: THREE.Mesh;
}

export class ObstacleView implements Loadable, Drawable {
  private readonly roadWorld: RoadWorld;
  private readonly threeSetup: ThreeSetup;
  private meshes: ObstacleMesh[] = [];

  constructor(roadWorld: RoadWorld, threeSetup: ThreeSetup) {
    this.roadWorld = roadWorld;
    this.threeSetup = threeSetup;
  }

  load(): Promise<void> {
    for (const def of this.roadWorld.defs) {
      const w = def.widthFrac * ROAD_WIDTH;
      const h = w * def.aspect;
      const d = w * 0.6; // depth of the box

      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ color: new THREE.Color(def.color) }),
      );

      mesh.castShadow = true;
      mesh.visible = false; // hidden until worldZ puts it in range
      this.threeSetup.scene.add(mesh);
      this.meshes.push({ def, mesh });
    }
    return Promise.resolve();
  }

  draw(): void {
    const active = this.roadWorld.activeObstacles;

    for (const { def, mesh } of this.meshes) {
      const obstacle = active.find((o) => o.id === def.id);

      if (!obstacle) {
        mesh.visible = false;
        continue;
      }

      const { worldZ, xFrac, widthFrac, aspect } = obstacle;
      const w = widthFrac * ROAD_WIDTH;
      const h = w * aspect;

      mesh.position.set(
        xFrac * (ROAD_WIDTH / 2), // lane position
        h / 2, // sit on road surface
        -worldZ * WORLD_Z_SCALE - ROAD_NEAR_OFFSET, // depth offset onto the road
      );

      // Fade opacity below worldZ 0.9 — matches old 2D behaviour
      const FADE_START = 0.9;
      const FADE_END = 0.5;
      const alpha =
        worldZ >= FADE_START
          ? 1
          : Math.max(0, (worldZ - FADE_END) / (FADE_START - FADE_END));

      (mesh.material as THREE.MeshLambertMaterial).transparent = alpha < 1;
      (mesh.material as THREE.MeshLambertMaterial).opacity = alpha;
      mesh.visible = alpha > 0;
    }
  }
}
