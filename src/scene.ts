import type { Entity, InputHandler, Loadable, Updatable } from "./engine";

export class Scene {
  private readonly entities: Entity[];
  private readonly inputHandlers: InputHandler[];
  private readonly systems: Updatable[];

  constructor(
    entities: Entity[],
    inputHandlers: InputHandler[],
    systems: Updatable[] = [],
  ) {
    this.entities = entities;
    this.inputHandlers = inputHandlers;
    this.systems = systems;
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
    this.systems.forEach((system) => system.update(deltaTime));
  }

  draw(): void {
    this.entities.forEach((entity) => entity.draw());
  }
}
