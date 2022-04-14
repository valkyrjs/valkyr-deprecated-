import { Event } from "./Event";

type Entity = {
  id: string;
};

export type AggregateRootClass<T extends AggregateRoot = AggregateRoot> = {
  new (): T;
};

export abstract class AggregateRoot {
  public abstract apply(event: Event): void;
  public abstract toJSON(): any;
}

export abstract class Aggregate<R extends AggregateRoot, T extends Entity> {
  private store = new Map<string, T>();

  constructor(protected root: R) {}

  public get index() {
    return Array.from(this.store.values());
  }

  public get size() {
    return this.store.size;
  }

  public add(entity: T) {
    this.store.set(entity.id, entity);
  }

  public get(id: string) {
    return this.store.get(id);
  }

  public update(id: string, entity: Partial<T>) {
    const stored = this.get(id);
    if (stored) {
      this.store.set(id, {
        ...stored,
        ...entity
      });
    }
  }

  public remove(id: string) {
    this.store.delete(id);
  }

  public toJSON() {
    return this.index;
  }
}
