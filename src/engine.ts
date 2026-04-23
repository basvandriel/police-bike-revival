export interface Updatable {
  update(deltaTime: number): void;
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface InputHandler {
  attach(): void;
  detach(): void;
}

export interface Loadable {
  load(): Promise<void>;
}

export type Entity = Updatable & Drawable;
