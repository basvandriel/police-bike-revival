import type { Entity, Loadable } from "./engine";
import type { BikeModel } from "./bike-model";
import type { BikeView } from "./bike-view";
import type { MovementStrategy } from "./movement-strategy";

export class BikeEntity implements Entity, Loadable {
  private readonly model: BikeModel;
  private readonly view: BikeView;
  private readonly strategy: MovementStrategy;

  constructor(model: BikeModel, view: BikeView, strategy: MovementStrategy) {
    this.model = model;
    this.view = view;
    this.strategy = strategy;
  }

  load(): Promise<void> {
    return this.view.load();
  }

  update(deltaTime: number): void {
    this.strategy.update(this.model, deltaTime);
    this.model.update(deltaTime);
  }

  draw(): void {
    this.view.draw();
  }
}
