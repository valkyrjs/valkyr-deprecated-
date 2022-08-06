import { LedgerEvent, LedgerEventRecord } from "./Event";

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export abstract class AggregateRoot<State extends Record<string, unknown> = any> {
  abstract apply(event: LedgerEventRecord<LedgerEvent>): void;

  toJSON(): State {
    const state: State = {} as State;
    for (const key in this) {
      if (typeof this[key] !== "function") {
        (state as any)[key] = this[key];
      }
    }
    return state;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregate
 |--------------------------------------------------------------------------------
 */

export abstract class Aggregate<R extends AggregateRoot, T extends Entity> {
  #store = new Map<string, T>();

  constructor(readonly root: R) {}

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  /**
   * List of entities stored within the aggregate.
   */
  get index() {
    return Array.from(this.#store.values());
  }

  /**
   * Current number of entities stored within the aggregate.
   */
  get size() {
    return this.#store.size;
  }

  /*
   |--------------------------------------------------------------------------------
   | CRUD
   |--------------------------------------------------------------------------------
   */

  /**
   * Adds a new entity to the aggregate store.
   *
   * @param entity - Entity to add to the aggregate store.
   */
  add(entity: T): void {
    this.#store.set(entity.id, entity);
  }

  /**
   * Gets an entity from the store by its id.
   *
   * @param id - Entity id to get.
   */
  get(id: string): T | undefined {
    return this.#store.get(id);
  }

  /**
   * Updates an entity if it exists with the new entity details.
   *
   * @param id   - Entity id.
   * @param data - Partial data to apply to the existing entity.
   */
  update(id: string, data: Partial<T>): void {
    const entity = this.get(id);
    if (entity) {
      this.#store.set(id, {
        ...entity,
        ...data
      });
    }
  }

  /**
   * Removes a entity from the aggregate store.
   *
   * @param id - Entity id to remove.
   */
  remove(id: string): void {
    this.#store.delete(id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializers
   |--------------------------------------------------------------------------------
   */

  toJSON() {
    return this.index;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Entity = {
  id: string;
};

export type AggregateRootClass<T extends AggregateRoot = AggregateRoot> = {
  new (): T;
};
