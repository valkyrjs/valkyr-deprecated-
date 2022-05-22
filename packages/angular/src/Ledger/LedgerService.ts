/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from "@angular/core";
import { IdentityService } from "@valkyr/identity";
import {
  AggregateRootClass,
  createEventRecord,
  LedgerEvent,
  LedgerEventRecord,
  LedgerEventStatus,
  projector,
  Queue,
  validator
} from "@valkyr/ledger";

import { Event, EventDocument, EventModel } from "./Models/Event";
import { StreamSubscriber } from "./StreamSubscriber";

export const PUBLIC_LEDGER_ALIAS = "ledger:public";
export const LEDGER_STREAM_KEY = "ledger:streams";

type EventRecord = LedgerEventRecord<LedgerEvent>;

@Injectable({ providedIn: "root" })
export class LedgerService {
  readonly #streams: Record<string, StreamSubscriber> = {};
  readonly #queue: Queue<EventRecord>;

  constructor(@Inject(Event) readonly events: EventModel, readonly identity: IdentityService) {
    this.#queue = new Queue<EventRecord>(this.#handleEvent.bind(this));
  }

  // ### Event Handler

  async #handleEvent(event: EventRecord) {
    await this.events.insert(event);
  }

  // ### Write Utilities

  async append(streamId: string, event: LedgerEvent): Promise<void> {
    const record = createEventRecord(streamId, event);
    await this.insert(record, false);
    this.#push(record);
  }

  async insert(event: EventRecord, hydrated = false): Promise<void> {
    const status = await this.status(event);
    if (status.exists === true) {
      return; // event already exists, no further actions required
    }
    await validator.validate(event);
    await this.#queue.push(event, Promise.resolve, Promise.reject);
    await projector.project(event, { hydrated, outdated: status.outdated }).catch(console.log);
  }

  #push(event: EventRecord) {
    // this.gun.get(alias).get(LEDGER_STREAM_KEY).get(event.streamId).get(event.id).put(JSON.stringify(event));
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
  async status({ id, streamId, type, created }: EventDocument): Promise<LedgerEventStatus> {
    const record = await this.events.findOne({ id });
    if (record) {
      return { exists: true, outdated: true };
    }
    const count = await this.events.count({
      streamId,
      type,
      created: {
        $gt: created
      }
    });
    return { exists: false, outdated: count > 0 };
  }

  // ### Stream Utilities

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
   * @remarks If sequential handling of an event is required, make sure to
   *          perform said event creation on a central back end ledger.
   *
   * This method operates by pulling all the latest known events of an event
   * stream and reduces them into a single current state representing of
   * the event stream.
   */
  async reduce<AggregateRoot extends AggregateRootClass>(
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

  streams(alias = PUBLIC_LEDGER_ALIAS): string[] {
    const streams: string[] = [];
    // this.gun
    //   .get(alias)
    //   .get(LEDGER_STREAM_KEY)
    //   .map()
    //   .once((streams) => {
    //     for (const streamId in streams) {
    //       streams.push(streamId);
    //     }
    //   });
    return streams;
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
  async stream(streamId: string, timestamp?: string, sortDirection: 1 | -1 = 1): Promise<EventRecord[]> {
    const filter: any = { streamId };
    if (timestamp) {
      filter.created = {
        [sortDirection === 1 ? "$gt" : "$lt"]: timestamp
      };
    }
    // await this.pull(streamId);
    return this.events.find(filter, { sort: { created: sortDirection } });
  }

  // ### Subscription Utilities

  /**
   * When subscribing we keep track of all instances that are currently observing
   * the provided id. This way we can ensure that we can keep the observer alive
   * until there are no longer any active subscribers.
   *
   * This approach allows us to only have a single observer for multiple
   * subscribers removing the issue of having multiple subscribers attempting to
   * update the event store with the same event.
   *
   * @param streamId - Stream to subscribe to.
   * @param alias    - Alias in which the event stream is located.
   */
  subscribe(streamId: string, alias = PUBLIC_LEDGER_ALIAS): LedgerSubscription {
    const subscriber = this.#getSubscriber(streamId);
    if (subscriber.isEmpty === true) {
      this.#join(streamId, alias);
    }
    subscriber.increment();
    return {
      unsubscribe: () => {
        this.unsubscribe(streamId, alias);
      }
    };
  }

  /**
   * Decrement observer amount by 1 and delete the stream stream observer if the
   * remaining subscribers is 0 or less.
   *
   * @param streamId - Stream to unsubscribe from.
   * @param alias    - Alias in which the event stream is located.
   */
  unsubscribe(streamId: string, alias: string): void {
    const subscriber = this.#streams[streamId];
    subscriber.decrement();
    if (subscriber.isEmpty) {
      this.#leave(streamId, alias);
      delete this.#streams[streamId];
    }
  }

  #join(streamId: string, alias: string): void {
    // this.gun
    //   .get(alias)
    //   .get(LEDGER_STREAM_KEY)
    //   .get(streamId)
    //   .on((message) => {
    //     const event = JSON.parse(message); // message will be encrypted, here we decrypt
    //     this.append(event);
    //   });
  }

  #leave(streamId: string, alias: string): void {
    // this.socket.send("streams:leave", { streamId });
  }

  // ### State Utilities

  #getSubscriber(streamId: string): StreamSubscriber {
    if (this.#streams[streamId] === undefined) {
      this.#streams[streamId] = new StreamSubscriber();
    }
    return this.#streams[streamId];
  }
}

export type LedgerSubscription = { unsubscribe: () => void };
