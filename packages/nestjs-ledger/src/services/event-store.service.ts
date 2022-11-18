import { Injectable, Logger } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";
import { InjectModel } from "@nestjs/mongoose";
import {
  createEventRecord,
  Event,
  EventRecord,
  EventStatus,
  getLogicalTimestamp,
  ReduceHandler,
  validator
} from "@valkyr/ledger";
import { Model } from "mongoose";

import { EventDocument, EventEntity } from "../models/event.entity";
import { projector } from "../Projector";

const logger = new Logger("Ledger");

@Injectable()
export class EventStoreService {
  constructor(@InjectModel(EventEntity.name) readonly events: Model<EventDocument>) {}

  /*
   |--------------------------------------------------------------------------------
   | Validation & Projection Proxies
   |--------------------------------------------------------------------------------
   */

  get validate() {
    return validator.validate;
  }

  get project() {
    return projector.project;
  }

  /*
   |--------------------------------------------------------------------------------
   | Write Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Insert a new event to the local event store database.
   *
   * This method triggers event validation and projection. If validation fails the
   * event will not be appended.
   *
   * @param stream - Stream name/id.
   * @param event  - Event or EventRecord to append to given stream.
   */
  async appendToStream(stream: string, event: Event | EventRecord): Promise<void> {
    const { record, exists, outdated, hydrated } = await this.#handleIncomingEvent(stream, event);
    if (exists === true) {
      return; // event already exists, no further actions required
    }

    await validator.validate(record);
    await this.events.create(record);

    projector.project(record, { hydrated, outdated });

    logger.debug(`Event '${event.type}' Appended\n${clc.cyanBright(JSON.stringify(event, null, 2))}`);
  }

  /*
   |--------------------------------------------------------------------------------
   | Read Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Enable the ability to check an incoming events status in relation to
   * the local ledger. This is to determine what actions to take upon the
   * ledger based on the current status.
   *
   * **Exists**
   *
   * References the existence of the event in the local ledger. It is
   * determined by looking at the recorded event id which should be unique
   * to the entirety of the ledger.
   *
   * **Outdated**
   *
   * References the events created relationship to the same event type in
   * the hosted stream. If another event of the same type in the stream
   * is newer than the provided event, the provided event is considered
   * outdated.
   */
  async getEventStatus({ id, stream, type, created }: EventRecord): Promise<EventStatus> {
    const record = await this.events.findOne({ id });
    if (record) {
      return { exists: true, outdated: true };
    }
    const count = await this.events.count({
      stream,
      type,
      created: {
        $gt: created
      }
    });
    return { exists: false, outdated: count > 0 };
  }

  /*
   |--------------------------------------------------------------------------------
   | Stream Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * An event reducer aims to create an aggregate state that is as close
   * to up to date as possible. This is handy when we want to perform
   * things such as business logic on the command/action layer of the event
   * creation lifecycle.
   *
   * By default the state is as close as possible since we are operating
   * in a distributed system without a central authority or sequential
   * event bus. As such developers is advised to build with failure at a
   * later date as an option.
   *
   * This method operates by pulling all the latest known events of an event
   * stream and reduces them into a single current state representing of
   * the event stream.
   */
  async reduceStream<Reduce extends ReduceHandler>(
    stream: string,
    reduce: Reduce
  ): Promise<ReturnType<Reduce> | undefined> {
    const events = await this.readStream(stream);
    if (events.length === 0) {
      return undefined;
    }
    return reduce(events);
  }

  /**
   * Retrieve all events for a given stream. Provided timestamp allows for
   * providing a specific point in time to retrieve before or after based
   * on a provided sort direction.
   *
   * To ensure that we have the latest events in the stream at the time
   * of the request, we send a pull request to the attached remote service
   * before executing the local event query.
   */
  async readStream<E extends EventRecord>(stream: string, options?: ReadOptions): Promise<E[]> {
    const revisionType = options?.fromRevision?.type ?? "created";
    const revisionValue = options?.fromRevision?.value;
    const directionValue = options?.direction === "BACKWARD" ? "$lt" : "$gt";

    const filter: any = { stream };
    if (revisionValue !== undefined) {
      filter[revisionType] = {
        [directionValue]: revisionValue
      };
    }

    return (await this.events.find(filter).sort({ [revisionType]: options?.direction === "BACKWARD" ? -1 : 1 })) as any;
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Utilities
   |--------------------------------------------------------------------------------
   */

  async #handleIncomingEvent(
    stream: string,
    event: Event | EventRecord
  ): Promise<{ record: EventRecord; hydrated: boolean } & EventStatus> {
    if (isEventRecord(event)) {
      return {
        record: { ...event, stream, recorded: getLogicalTimestamp() },
        hydrated: true,
        ...(await this.getEventStatus(event))
      };
    }
    return { record: createEventRecord(stream, event), hydrated: false, exists: false, outdated: false };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Type Guards
 |--------------------------------------------------------------------------------
 */

function isEventRecord(event: Event | EventRecord): event is EventRecord {
  return (event as EventRecord).id !== undefined;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ReadOptions = {
  /**
   * Get events from a specific point in time.
   */
  fromRevision?: {
    /**
     * Revision type to use when retrieving events. Defaults to
     * "created" which is the origin time of the event.
     */
    type?: "created" | "recorded";

    /**
     * The point of time to start retrieving events from.
     */
    value: string;
  };

  /**
   * Which direction from the provided revision to get events.
   */
  direction?: "FORWARD" | "BACKWARD";
};
