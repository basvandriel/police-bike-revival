import "./style.css";
import { Game } from "./game";
import { Hud } from "./hud";
import { BikeModel } from "./bike-model";
import { BikeView } from "./bike-view";
import { BikeEntity } from "./bike-entity";
import { BikeMouseController } from "./input";
import { Scene } from "./scene";
import { BIKE_WIDTH, BIKE_HEIGHT } from "./constants";
import bikeUrl from "./assets/police-bike.svg";

const canvas = document.querySelector<HTMLCanvasElement>("#game");
const scoreElement = document.querySelector<HTMLSpanElement>("#score");
const healthElement = document.querySelector<HTMLSpanElement>("#health");

if (!canvas) throw ReferenceError("Canvas element not found");
if (!scoreElement) throw ReferenceError("Score element not found");
if (!healthElement) throw ReferenceError("Health element not found");

const bikeModel = new BikeModel(
  (canvas.width - BIKE_WIDTH) / 2,
  canvas.height - BIKE_HEIGHT - 16,
);
const bikeView = new BikeView(bikeUrl, bikeModel);
const bikeEntity = new BikeEntity(bikeModel, bikeView);
const hud = new Hud(scoreElement, healthElement);
const input = new BikeMouseController(canvas, bikeModel);
const scene = new Scene([bikeEntity], [input]);

const game = new Game(canvas, hud, scene, [input]);

void game.init().then(() => game.start());
