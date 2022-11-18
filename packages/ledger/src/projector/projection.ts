import type { EventRecord } from "../event";
import type { ProjectionFilter } from "./filters";
import type { Projector } from "./projector";

export class Projection<Event extends EventRecord> {
  #projector: Projector;
  #type: Event["type"];
  #handle: ProjectionEventHandler<Event>;
  #filter: ProjectionFilter;

  #listener?: () => void;

  constructor(projector: Projector, { type, handler, filter }: ProjectionOptions<Event>) {
    this.#projector = projector;
    this.#type = type;
    this.#handle = handler;
    this.#filter = filter;
    this.start();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Check if the incoming event state is compatible with the projection filter.
   */
  isValid({ hydrated, outdated }: ProjectionState) {
    if (this.#filter.allowHydratedEvents === false && hydrated === true) {
      return false;
    }
    if (this.#filter.allowOutdatedEvents === false && outdated === true) {
      return false;
    }
    return true;
  }

  /*
   |--------------------------------------------------------------------------------
   | Controllers
   |--------------------------------------------------------------------------------
   */

  /**
   * Start the projection by registering the projection handler against the
   * projections event emitter.
   */
  start() {
    this.#listener = this.#projector.addEventListener(this.#type as string, async (event, state) => {
      if (this.isValid(state)) {
        await this.#handle(event as Event);
      }
    });
  }

  /**
   * Stop the projection by removing the projection handler registered with the
   * projections event emitter.
   */
  stop() {
    this.#listener?.();
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ProjectionOptions<Event extends EventRecord> = {
  type: Event["type"];
  handler: ProjectionEventHandler<Event>;
  filter: ProjectionFilter;
};

export type ProjectionState = {
  hydrated: boolean;
  outdated: boolean;
};

export type ProjectionHandler<Event extends EventRecord = EventRecord> = (
  event: Event,
  state: ProjectionState
) => Promise<void>;

export type ProjectionEventHandler<Event extends EventRecord = EventRecord> = (event: Event) => Promise<void>;
