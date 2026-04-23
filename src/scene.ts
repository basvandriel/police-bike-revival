import type { Entity, InputHandler, Loadable } from "./engine";

export class Scene {
  private readonly entities: Entity[];
  private readonly inputHandlers: InputHandler[];

  constructor(entities: Entity[], inputHandlers: InputHandler[]) {
    this.entities = entities;
    this.inputHandlers = inputHandlers;
  }

  async load(): Promise<void> {
    await Promise.all(
      this.entities.map((entity) => {
        const loadable = entity as Partial<Loadable>;
        return loadable.load ? loadable.load() : Promise.resolve();
      }),
    );
  }

  attachInputs(): void {
    this.inputHandlers.forEach((input) => input.attach());
  }

  detachInputs(): void {
    this.inputHandlers.forEach((input) => input.detach());
  }

  update(deltaTime: number): void {
    this.entities.forEach((entity) => entity.update(deltaTime));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.entities.forEach((entity) => entity.draw(ctx));
  }
}
