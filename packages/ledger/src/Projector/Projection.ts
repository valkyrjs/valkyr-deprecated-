import type { EventRecord } from "../Event/index";
import type { ProjectionFilter } from "./Filters";
import type { Projector } from "./Projector";

export class Projection<Record extends EventRecord> {
  #projector: Projector<Record>;
  #type: Event["type"];
  #handle: ProjectionEventHandler<Record>;
  #filter: ProjectionFilter;

  #listener?: () => void;

  constructor(projector: Projector<Record>, { type, handler, filter }: ProjectionOptions<Record>) {
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
        await this.#handle(event as Record);
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

type ProjectionOptions<Record extends EventRecord> = {
  type: Record["type"];
  handler: ProjectionEventHandler<Record>;
  filter: ProjectionFilter;
};

export type ProjectionState = {
  hydrated: boolean;
  outdated: boolean;
};

export type ProjectionHandler<Record extends EventRecord = EventRecord> = (
  eventRecord: Record,
  state: ProjectionState
) => Promise<void>;

export type ProjectionEventHandler<Record extends EventRecord> = (eventRecord: Record) => Promise<void>;
