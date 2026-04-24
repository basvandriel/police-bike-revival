import type { Entity, Loadable } from "./engine";
import type { BackgroundModel } from "./background-model";
import type { BackgroundView } from "./background-view";

export class BackgroundEntity implements Entity, Loadable {
  private readonly model: BackgroundModel;
  private readonly view: BackgroundView;

  constructor(model: BackgroundModel, view: BackgroundView) {
    this.model = model;
    this.view = view;
  }

  load(): Promise<void> {
    return this.view.load();
  }

  update(deltaTime: number): void {
    this.model.update(deltaTime);
  }

  draw(): void {
    this.view.draw();
  }
}
