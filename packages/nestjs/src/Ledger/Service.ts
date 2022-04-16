import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AggregateRootClass, createEventRecord, Event as LedgerEvent, publisher } from "@valkyr/ledger";
import { Model } from "mongoose";

import { Event, EventDocument } from "./Model";

@Injectable()
export class LedgerService {
  constructor(@InjectModel(Event.name) private collection: Model<EventDocument>) {}

  /**
   * Insert event into the local ledger.
   *
   * Events are inserted by updating the recorded value of the event before
   * it is added to the ledger. This is a distributed reference point and
   * each distributed service using a ledger will have its own recorded
   * date of each event it has seen.
   *
   * @param event - Event to insert into the local ledger.
   */
  public async insert(event: LedgerEvent) {
    const record = createEventRecord(event);
    await this.collection.create(record);
    await publisher.project(record, { hydrated: false, outdated: false });
    // this.server.to(`stream:${event.streamId}`).emit("event", event);
  }

  /**
   * Reduce an event stream down to its final aggregate state representation.
   *
   * We do this by left folding all events in a stream down to a single
   * representation of the entire stream.
   *
   * @param streamId - Stream to pull events from.
   * @param reducer  - Reducer method used to fold the stream events.
   *
   * @returns Aggregate state of the stream
   */
  public async reduce<AggregateRoot extends AggregateRootClass>(
    streamId: string,
    aggregate: AggregateRoot
  ): Promise<InstanceType<AggregateRoot> | undefined> {
    const events = await this.stream(streamId);
    if (events.length === 0) {
      return undefined;
    }
    const instance = new aggregate();
    for (const event of events) {
      instance.apply(event);
    }
    return instance as InstanceType<AggregateRoot>;
  }

  /**
   * Enable the ability to check if an incoming even is outdated within its
   * stream or not. This is used to avoid overwriting newer events that may
   * arrive later in distributed environments.
   *
   * Outdated checks works by checking the actual creation date of the event
   * when it was created for the first time. If another event of the same
   * type in the same stream exists and is newer the event is considered
   * outdated.
   *
   * @param event - Event to check against the local ledger.
   *
   * @returns Outdated state of the event
   */
  public async outdated({ streamId, type, created }: LedgerEvent): Promise<boolean> {
    return this.collection.count({ streamId, type, created: { $gt: created } }).then((count) => count > 0);
  }

  /**
   * Provide all the events for the entire ledger.
   *
   * @param created   - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   *
   * @returns Events in the ledger
   */
  public async events(created?: string, direction?: 1 | -1) {
    const filter: any = {};
    if (created) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: created
      };
    }
    return this.collection.find(filter).sort("created");
  }

  /**
   * Provide all the events for a given stream.
   *
   * @param streamId  - Stream identifier to retrieve events from.
   * @param created   - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   *
   * @returns Events found for the given stream
   */
  public async stream(streamId: string, created?: string, direction: 1 | -1 = 1) {
    const filter: any = { streamId };
    if (created) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: created
      };
    }
    return this.collection.find(filter).sort({ created: direction });
  }

  /**
   * Pull all events in order of locally recorded timestamp.
   *
   * @param streamId - Stream to pull.
   * @param recorded - Get events form a specific point in time.
   *
   * @returns Events
   */
  public async pull(streamId: string, recorded?: string) {
    const filter: any = { streamId };
    if (recorded) {
      filter.recorded = {
        $gt: recorded
      };
    }
    return this.collection.find(filter).sort({ recorded: 1 });
  }
}
