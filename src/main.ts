import "./style.css";
import { Game } from "./game";
import { Hud } from "./hud";
import { BikeModel } from "./bike-model";
import { BikeView } from "./bike-view";
import { BikeEntity } from "./bike-entity";
import { MouseMovementStrategy } from "./movement-strategy";
import { BackgroundModel } from "./background-model";
import { BackgroundView } from "./background-view";
import { BackgroundEntity } from "./background-entity";
import { RoadWorld } from "./road-world";
import { ObstacleView } from "./obstacle-view";
import { CollisionSystem } from "./collision-system";
import { Scene } from "./scene";
import { ThreeSetup } from "./three-setup";
import {
  BIKE_WIDTH,
  BIKE_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./constants";
import bikeUrl from "./assets/police-bike.svg";

const canvas = document.querySelector<HTMLCanvasElement>("#game");
const scoreElement = document.querySelector<HTMLSpanElement>("#score");
const healthElement = document.querySelector<HTMLSpanElement>("#health");

if (!canvas) throw ReferenceError("Canvas element not found");
if (!scoreElement) throw ReferenceError("Score element not found");
if (!healthElement) throw ReferenceError("Health element not found");

const threeSetup = new ThreeSetup(canvas);

const backgroundModel = new BackgroundModel(200);
const roadWorld = new RoadWorld(backgroundModel);

const backgroundView = new BackgroundView(backgroundModel, threeSetup);
const backgroundEntity = new BackgroundEntity(backgroundModel, backgroundView);

const obstacleView = new ObstacleView(roadWorld, threeSetup);

const bikeModel = new BikeModel(
  (CANVAS_WIDTH - BIKE_WIDTH) / 2,
  CANVAS_HEIGHT - BIKE_HEIGHT - 16,
);
const bikeView = new BikeView(bikeUrl, bikeModel, threeSetup);
const mouseStrategy = new MouseMovementStrategy(canvas);
const bikeEntity = new BikeEntity(bikeModel, bikeView, mouseStrategy);
const hud = new Hud(scoreElement, healthElement);
const collisionSystem = new CollisionSystem(bikeModel, roadWorld);

const scene = new Scene(
  [
    backgroundEntity,
    { update: () => {}, draw: () => obstacleView.draw() },
    bikeEntity,
  ],
  [mouseStrategy],
  [collisionSystem],
);

const game = new Game(hud, scene, threeSetup, [mouseStrategy]);

function spawnRandomObstacle(): void {
  const id = Math.random().toString(36).substring(2, 9);
  const color = `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
  const xFracOptions = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
  const xFrac = xFracOptions[Math.floor(Math.random() * xFracOptions.length)];
  const widthFrac = 0.08 + Math.random() * 0.08;
  const aspect = 1.6 + Math.random() * 0.6;
  const worldZPhase = 0.15 + Math.random() * 0.7;
  const label = `...${Math.floor(Math.random() * 100)}`;

  roadWorld.spawnObstacle({
    id,
    worldZPhase,
    xFrac,
    widthFrac,
    aspect,
    color,
    label,
  });
}

collisionSystem.on("hit", ({ obstacleId }) => {
  game.onObstacleHit(obstacleId);

  // remove the obstacle from the world before spawning a new one
  roadWorld.rmDef(obstacleId);
  spawnRandomObstacle();
});

void Promise.all([game.init(), obstacleView.load()]).then(() => game.start());
