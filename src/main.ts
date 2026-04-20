import { BIKE_HEIGHT, BIKE_WIDTH } from "./constants";
import type GameState from "./state";
import "./style.css";

import bikeUrl from "./assets/police-bike.svg";

const canvasElement = document.querySelector<HTMLCanvasElement>("#game");
const scoreElementRef = document.querySelector<HTMLSpanElement>("#score");
const healthElementRef = document.querySelector<HTMLSpanElement>("#health");

if (!canvasElement) throw ReferenceError("Canvas element not found, aborting app.");

if (!scoreElementRef)
  throw ReferenceError("Score element not found, aborting app.");

if (!healthElementRef)
  throw ReferenceError("Health element not found, aborting app.");

const canvas = canvasElement;
const scoreElement = scoreElementRef;
const healthElement = healthElementRef;
const ctx = canvas.getContext("2d")!;

canvas.width = 800;
canvas.height = 600;

const state: GameState = {
  score: 50,
  health: 50,
};

const bike = new Image();
bike.src = bikeUrl;
let bikeLoaded = false;

const bikePosition = {
  x: (canvas.width - BIKE_WIDTH) / 2,
  y: canvas.height - BIKE_HEIGHT - 16,
};

function updateHud(state: GameState) {
  scoreElement.textContent = `Score: ${state.score}`;
  healthElement.textContent = `Health: ${state.health}`;
}

function drawBackground() {
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBike() {
  if (!bikeLoaded) {
    return;
  }

  ctx.drawImage(bike, bikePosition.x, bikePosition.y, BIKE_WIDTH, BIKE_HEIGHT);
}

function draw() {
  drawBackground();
  drawBike();
}

function update() {
  // Game logic goes here.
  // In a real game, this is where you would move the bike, handle input,
  // detect collisions, and update score/health.
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bike.onload = () => {
  bikeLoaded = true;
  updateHud(state);
  requestAnimationFrame(loop);
};

updateHud(state);
