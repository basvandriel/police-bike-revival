import type { Entity, Loadable } from "./engine";
import type { BikeModel } from "./bike-model";
import type { BikeView } from "./bike-view";

export class BikeEntity implements Entity, Loadable {
  private readonly model: BikeModel;
  private readonly view: BikeView;

  constructor(model: BikeModel, view: BikeView) {
    this.model = model;
    this.view = view;
  }

  load(): Promise<void> {
    return this.view.load();
  }

  update(deltaTime: number): void {
    this.model.update(deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.view.draw(ctx);
  }
}
