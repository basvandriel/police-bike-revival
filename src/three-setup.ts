import * as THREE from "three";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

/**
 * Owns the Three.js renderer, scene and camera.
 * Passed into views at construction time so they can add/update meshes.
 * Call render() once per game loop tick after all views have updated.
 */
export class ThreeSetup {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x2d4060, 40, 120);

    // Sky colour — gradient would need a shader; solid dark blue matches the
    // current game's top sky colour well enough.
    this.scene.background = new THREE.Color(0x07101f);

    // Camera sits at the near edge of the road (z=0), 2 units above the surface.
    // lookAt(0,0,-5.4): direction=(0,-2,-5.4), pitch=atan(2/5.4)=20.3°
    // → horizon lands at ~18% from top, matching HORIZON_FRAC=0.18.
    // Keeping z=0 means every downward ray hits the road — no gray gap at the bottom.
    this.camera = new THREE.PerspectiveCamera(
      60,
      CANVAS_WIDTH / CANVAS_HEIGHT,
      0.1,
      500,
    );
    this.camera.position.set(0, 2, 0);
    this.camera.lookAt(0, 0, -5.4);

    // Ambient fill so nothing is pitch black
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Sun — slightly off-axis for directional shading on the box faces
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(4, 10, 6);
    sun.castShadow = true;
    this.scene.add(sun);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
