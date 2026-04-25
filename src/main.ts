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

collisionSystem.on("hit", ({ obstacleId }) => {
  game.onObstacleHit(obstacleId);

  // we need to remove the obstacle from the game, which is in roadworld
  roadWorld.rmDef(obstacleId);

  roadWorld.spawnObstacle(
    roadWorld.defs[Math.floor(Math.random() * roadWorld.defs.length)],
  );
});

void Promise.all([game.init(), obstacleView.load()]).then(() => game.start());
