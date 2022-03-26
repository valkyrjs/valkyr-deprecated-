import { Event } from "./Event";

export type AggregateRootClass<T extends AggregateRoot = AggregateRoot> = {
  new (): T;
};

export abstract class AggregateRoot {
  public abstract apply(event: Event): void;
}
