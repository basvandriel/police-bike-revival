import { BIKE_HEIGHT, BIKE_WIDTH } from "./constants";
import type GameState from "./state";
import "./style.css";

import bikeUrl from "./assets/police-bike.svg";

const canvasElement = document.querySelector<HTMLCanvasElement>("#game");
const scoreElementRef = document.querySelector<HTMLSpanElement>("#score");
const healthElementRef = document.querySelector<HTMLSpanElement>("#health");

if (!canvasElement)
  throw ReferenceError("Canvas element not found, aborting app.");

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

const MAX_TILT = 0.45;
const TILT_SPEED = 0.1;
const TILT_RECOVER_DELAY = 250; // ms before tilt starts returning to center

const bikeState = {
  x: (canvas.width - BIKE_WIDTH) / 2,
  y: canvas.height - BIKE_HEIGHT - 16,

  // We have 2 properties for having a small delay between the current tilt and the target tilt,
  // so the bike doesn't instantly snap to the new angle.
  tilt: 0,
  targetTilt: 0,
};

let lastMouseMove = 0;

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

  // Rotate around the bike center, not the top-left of the canvas.
  const cx = bikeState.x + BIKE_WIDTH / 2;
  const cy = bikeState.y + BIKE_HEIGHT / 2;

  ctx.save();
  ctx.translate(cx, cy); // move origin to the bike's center
  ctx.rotate(bikeState.tilt); // rotate around the new origin

  // draw the bike centered at the rotated origin
  ctx.drawImage(
    bike,
    -BIKE_WIDTH / 2,
    -BIKE_HEIGHT / 2,
    BIKE_WIDTH,
    BIKE_HEIGHT,
  );
  ctx.restore(); // restore the canvas state so later draws are not rotated
}

function draw() {
  drawBackground();

  // The tilt is already part of bikeState, so drawBike() just renders it.
  drawBike();
}

function update() {
  const now = performance.now();
  const isSteering = now - lastMouseMove < TILT_RECOVER_DELAY;
  const targetTilt = isSteering ? bikeState.targetTilt : 0;

  bikeState.tilt += (targetTilt - bikeState.tilt) * TILT_SPEED;

  if (Math.abs(bikeState.tilt) < 0.001) {
    bikeState.tilt = 0;
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Can we also do this with manu dependencies?
bike.onload = () => {
  bikeLoaded = true;

  updateHud(state);
  requestAnimationFrame(loop);
};

updateHud(state);

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;

  const nextX = Math.max(
    0,
    Math.min(mouseX - BIKE_WIDTH / 2, canvas.width - BIKE_WIDTH),
  );

  const deltaX = nextX - bikeState.x;
  bikeState.x = nextX;

  // Set a target tilt based on movement direction and speed.
  bikeState.targetTilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, deltaX * 0.06));
  lastMouseMove = performance.now();
});
