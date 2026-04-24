export const SCORE_TEXT = "SCORE";
export const HEALTH_TEXT = "HEALTH";

export const DEFAULT_HEALTH = 50;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const BIKE_WIDTH = 200;
export const BIKE_HEIGHT = 200;

// Road geometry — shared by BackgroundView and CollisionSystem
export const ROAD_BOTTOM_WIDTH_FRAC = 0.9;
export const HORIZON_FRAC = 0.18;

// Obstacle world-Z — shared by RoadWorld, BackgroundView and CollisionSystem
export const OBSTACLE_MAX_Z = 20;
export const OBSTACLE_MIN_Z = 0.5; // low enough that obstacles exit below the canvas naturally
export const OBSTACLE_SCROLL_FACTOR = 0.016;
