import { BIKE_HEIGHT, BIKE_WIDTH } from "./constants";
import type GameState from "./state";
import "./style.css";

import bikeUrl from "./assets/police-bike.svg";

const canvasElement = document.querySelector<HTMLCanvasElement>("#game");
const scoreElementRef = document.querySelector<HTMLSpanElement>("#score");
const healthElementRef = document.querySelector<HTMLSpanElement>("#health");

if (!canvasElement) throw ReferenceError("Canvas element not found");
if (!scoreElementRef) throw ReferenceError("Score element not found");
if (!healthElementRef) throw ReferenceError("Health element not found");

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

interface BikeState {
  x: number;
  y: number;
  tilt: number;
  targetTilt: number;
  lastMoveTime: number;
}

const MAX_TILT = 0.45;
const TILT_SPEED = 0.12;
const TILT_RECOVER_DELAY = 250;

const bikeState: BikeState = {
  x: (canvas.width - BIKE_WIDTH) / 2,
  y: canvas.height - BIKE_HEIGHT - 16,
  tilt: 0,
  targetTilt: 0,
  lastMoveTime: 0,
};

function updateHud(state: GameState) {
  scoreElement.textContent = `Score: ${state.score}`;
  healthElement.textContent = `Health: ${state.health}`;
}

function draw() {
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!bike.complete) return;

  const centerX = bikeState.x + BIKE_WIDTH / 2;
  const centerY = bikeState.y + BIKE_HEIGHT / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(bikeState.tilt);
  ctx.drawImage(
    bike,
    -BIKE_WIDTH / 2,
    -BIKE_HEIGHT / 2,
    BIKE_WIDTH,
    BIKE_HEIGHT,
  );
  ctx.restore();
}

function update() {
  const now = performance.now();
  const active = now - bikeState.lastMoveTime < TILT_RECOVER_DELAY;
  const target = active ? bikeState.targetTilt : 0;

  bikeState.tilt += (target - bikeState.tilt) * TILT_SPEED;
  if (Math.abs(bikeState.tilt) < 0.001) bikeState.tilt = 0;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bike.onload = () => {
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
  bikeState.targetTilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, deltaX * 0.06));
  bikeState.lastMoveTime = performance.now();
});
