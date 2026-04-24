import * as THREE from "three";
import type { Loadable, Drawable } from "./engine";
import type { BackgroundModel } from "./background-model";
import type { ThreeSetup } from "./three-setup";

// World-space road dimensions — shared with ObstacleView and BikeView
export const ROAD_WIDTH = 8;
export const ROAD_LENGTH = 300;

/** Builds a 256×512 canvas texture with road markings baked in. */
function buildRoadTexture(): THREE.CanvasTexture {
  const W = 256;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Base road colour
  ctx.fillStyle = "#373e4d";
  ctx.fillRect(0, 0, W, H);

  // Alternating lighter bands for speed illusion
  ctx.fillStyle = "#22272f";
  for (let y = 0; y < H; y += 64) {
    ctx.fillRect(0, y, W, 32);
  }

  // Left and right edge white lines
  ctx.fillStyle = "rgba(220,220,220,0.85)";
  ctx.fillRect(4, 0, 8, H);
  ctx.fillRect(W - 12, 0, 8, H);

  // Centre dashes
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  for (let y = 8; y < H; y += 64) {
    ctx.fillRect(W / 2 - 4, y, 8, 32);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, ROAD_LENGTH / 8); // tile the texture along road length
  return tex;
}

export class BackgroundView implements Loadable, Drawable {
  private readonly model: BackgroundModel;
  private readonly threeSetup: ThreeSetup;
  private roadTexture!: THREE.CanvasTexture;

  constructor(model: BackgroundModel, threeSetup: ThreeSetup) {
    this.model = model;
    this.threeSetup = threeSetup;
  }

  load(): Promise<void> {
    const scene = this.threeSetup.scene;

    // Road surface
    this.roadTexture = buildRoadTexture();
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH),
      new THREE.MeshLambertMaterial({ map: this.roadTexture }),
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -(ROAD_LENGTH / 2));
    scene.add(road);

    // Grass verges left and right
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x1a2e10 });
    const grassGeo = new THREE.PlaneGeometry(200, ROAD_LENGTH);
    [-1, 1].forEach((side) => {
      const grass = new THREE.Mesh(grassGeo, grassMat);
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(
        side * (ROAD_WIDTH / 2 + 100),
        -0.01,
        -(ROAD_LENGTH / 2),
      );
      scene.add(grass);
    });

    // Horizon sky plane (fills the background above the road)
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x2d4060,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(
      new THREE.SphereGeometry(490, 16, 8),
      skyMat,
    );
    scene.add(skyDome);

    return Promise.resolve();
  }

  draw(): void {
    // Scroll the road texture to simulate forward motion
    this.roadTexture.offset.y = (this.model.scrollOffset * 0.003) % 1;
  }
}
