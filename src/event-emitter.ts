// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMap = Record<string, any>;
type Listener<T> = (data: T) => void;

/**
 * A tiny typed event emitter.
 *
 * The *emitter* is the object that owns emit() — it dispatches events.
 * A *listener* is the callback you register with on() — it receives events.
 * They are two sides of the same observer pattern.
 *
 * Usage:
 *   class Foo extends EventEmitter<{ change: { value: number } }> { ... }
 *   foo.on("change", ({ value }) => console.log(value));
 */
export class EventEmitter<T extends EventMap> {
  private readonly listeners: Partial<{ [K in keyof T]: Listener<T[K]>[] }> =
    {};

  on<K extends keyof T>(event: K, fn: Listener<T[K]>): void {
    (this.listeners[event] ??= []).push(fn);
  }

  off<K extends keyof T>(event: K, fn: Listener<T[K]>): void {
    const arr = this.listeners[event];
    if (arr) {
      this.listeners[event] = arr.filter(
        (l) => l !== fn,
      ) as Listener<T[K]>[];
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach((fn) => fn(data));
  }
}
