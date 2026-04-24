import * as THREE from "three";
import type { Loadable, Drawable } from "./engine";
import type { BikeModel } from "./bike-model";
import type { ThreeSetup } from "./three-setup";
import { BIKE_WIDTH, CANVAS_WIDTH } from "./constants";
import { ROAD_WIDTH } from "./background-view";

// Bike plane size in world units
const BIKE_WORLD_WIDTH = 2.2;
const BIKE_WORLD_HEIGHT = 2.2;

// Z position just in front of the camera (camera is at z=5, road starts at z=0)
const BIKE_Z = 2;

export class BikeView implements Loadable, Drawable {
  private readonly imageUrl: string;
  private readonly model: BikeModel;
  private readonly threeSetup: ThreeSetup;
  private mesh!: THREE.Mesh;

  constructor(imageUrl: string, model: BikeModel, threeSetup: ThreeSetup) {
    this.imageUrl = imageUrl;
    this.model = model;
    this.threeSetup = threeSetup;
  }

  load(): Promise<void> {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(this.imageUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        this.mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(BIKE_WORLD_WIDTH, BIKE_WORLD_HEIGHT),
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
          }),
        );

        this.mesh.position.set(0, BIKE_WORLD_HEIGHT / 2, BIKE_Z);
        this.threeSetup.scene.add(this.mesh);
        resolve();
      });
    });
  }

  draw(): void {
    if (!this.mesh) return;

    const { x, tilt } = this.model.state;

    // Map pixel x (0..CANVAS_WIDTH) to world x (-ROAD_WIDTH/2..ROAD_WIDTH/2)
    const bikeCenter = x + BIKE_WIDTH / 2;
    const worldX = (bikeCenter / CANVAS_WIDTH - 0.5) * ROAD_WIDTH;

    this.mesh.position.x = worldX;
    this.mesh.rotation.z = -tilt; // tilt is clockwise in 2D, negate for Three.js
  }
}
