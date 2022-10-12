import { Injectable, Logger } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";
import { InjectModel } from "@nestjs/mongoose";
import {
  createEventRecord,
  EventRecord,
  getLogicalTimestamp,
  LedgerEvent,
  LedgerEventStatus,
  ReduceHandler,
  validator
} from "@valkyr/ledger";
import { Model } from "mongoose";

import { Event, EventDocument } from "../Models/Event";
import { projector } from "../Projector";

const logger = new Logger("Ledger");

@Injectable()
export class LedgerService {
  constructor(@InjectModel(Event.name) readonly model: Model<EventDocument>) {}

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
   * Push a new event onto the local event store database.
   *
   * @remarks Push is meant to take events from the local services and insert them as new event
   * records as non hydrated events.
   *
   * @param streamId - Stream id the event belongs to.
   * @param event    - Event data to record.
   */
  async push(streamId: string, event: LedgerEvent): Promise<void> {
    return this.insert(createEventRecord(streamId, event), false);
  }

  /**
   * Record an event to the local event store database.
   *
   * @remarks Record is meant to take events from a remote resource and insert them as if they were
   * created by the local server. This means that events going through the append method will go
   * through possible projections as non hydrated events.
   *
   * The events `recorded` timestamp is also updated to represent the time the event was first seen
   * by the server.
   *
   * @param event - Event to append to the event store db.
   */
  async record(event: EventRecord): Promise<void> {
    return this.insert(
      {
        ...event,
        recorded: getLogicalTimestamp()
      },
      false
    );
  }

  /**
   * Insert a new event to the local event store database.
   *
   * @remarks This method triggers event validation and projection. If validation fails the event will
   * not be inserted. If the projection fails the projection itself should be handling the error based
   * on its own business logic.
   *
   * @param event    - Event to insert.
   * @param hydrated - Is this a newly created event?
   */
  async insert(event: EventRecord, hydrated = true): Promise<void> {
    const status = await this.status(event);
    if (status.exists === true) {
      return; // event already exists, no further actions required
    }

    await validator.validate(event);
    await this.model.create(event);
    await projector.project(event, { hydrated, outdated: status.outdated }).catch(console.log);

    logger.debug(`Event '${event.type}' Appended\n${clc.cyanBright(JSON.stringify(event, null, 2))}`);
  }

  /**
   * Retrieves events from the local ledger and projects them against the
   * running publisher instance.
   *
   * @param streamId - Stream id to hydrate. (Optional)
   * @param from     - Get events starting at a specific time position. (Optional)
   */
  async rehydrate(streamId?: string, from?: string) {
    const events = streamId ? await this.stream(streamId, from) : await this.events();
    for (const event of events) {
      await projector.project(event, { hydrated: true, outdated: false });
    }
  }

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
  async status({ id, streamId, type, created }: EventRecord): Promise<LedgerEventStatus> {
    const record = await this.model.findOne({ id });
    if (record) {
      return { exists: true, outdated: true };
    }
    const count = await this.model.count({
      streamId,
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
  async reduce<Reduce extends ReduceHandler>(
    streamId: string,
    reduce: Reduce
  ): Promise<ReturnType<Reduce> | undefined> {
    const events = await this.stream(streamId);
    if (events.length === 0) {
      return undefined;
    }
    return reduce(events);
  }

  /**
   * Provide all the events for the entire ledger.
   *
   * @param created   - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   *
   * @returns Events in the ledger
   */
  async events(created?: string, direction?: 1 | -1) {
    const filter: any = {};
    if (created) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: created
      };
    }
    return this.model.find(filter).sort("created");
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
  async stream(streamId: string, timestamp?: string, sortDirection: 1 | -1 = 1) {
    const filter: any = { streamId };
    if (timestamp) {
      filter.created = {
        [sortDirection === 1 ? "$gt" : "$lt"]: timestamp
      };
    }
    return this.model.find(filter).sort({ created: sortDirection });
  }

  /**
   * Pull all events in order of locally recorded timestamp.
   *
   * @param streamId - Stream to pull.
   * @param recorded - Get events form a specific point in time.
   *
   * @returns Events
   */
  async pull(streamId: string, recorded?: string) {
    const filter: any = { streamId };
    if (recorded) {
      filter.recorded = {
        $gt: recorded
      };
    }
    return this.model.find(filter).sort({ recorded: 1 });
  }
}
