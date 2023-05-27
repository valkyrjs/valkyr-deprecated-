import { Document, IndexedDatabase } from "@valkyr/db";
import { Subject } from "rxjs";

import {
  createEventRecord,
  Empty,
  Event as LedgerEvent,
  EventRecord,
  EventStatus,
  EventToRecord,
  getTimestamp
} from "./Event/mod.js";
import { Projector } from "./Projector/Projector.js";
import { ReduceHandler } from "./Reducer.js";
import { Remote, RemoteAdapter, RemoteSubscription } from "./Remote.js";
import { Validator } from "./Validator.js";

type EventList<Event extends LedgerEvent> = { [K in Event["type"]]: K };

type Options<Record extends EventRecord> = {
  remote: RemoteAdapter;
  events: EventList<Record>;
  validator?: Validator<Record>;
  projector?: Projector<Record>;
};

export class EventStore<Event extends LedgerEvent = LedgerEvent, Record extends EventRecord = EventToRecord<Event>> {
  readonly #remote: Remote;
  readonly #events: Set<Event["type"]>;
  readonly #db: IndexedDatabase<{
    events: Document<Record>;
  }>;

  readonly #inserted = new Subject<{ record: Record; hydrated: boolean }>();

  readonly #validator: Validator<Record>;
  readonly #projector: Projector<Record>;

  constructor(readonly name: string, options: Options<Record>) {
    this.#remote = new Remote(options.remote);
    this.#events = new Set(Object.keys(options.events));
    this.#db = new IndexedDatabase({
      name: `event-store:${name}`,
      version: 1,
      registrars: [
        {
          name: "events",
          indexes: [
            ["tenant", { unique: false }],
            ["stream", { unique: false }],
            ["created", { unique: false }],
            ["recorded", { unique: false }]
          ]
        }
      ]
    });

    this.#validator = options.validator ?? new Validator<Record>();
    this.#projector = options.projector ?? new Projector<Record>();

    this.#remote.subject.subscribe(([record, hydrated]) => {
      this.insert(record as any, hydrated);
    });

    this.push = this.push.bind(this);
    this.insert = this.insert.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Validation
   |--------------------------------------------------------------------------------
   */

  get validate() {
    return this.#validator.validate.bind(this.#validator);
  }

  /*
   |--------------------------------------------------------------------------------
   | Projections
   |--------------------------------------------------------------------------------
   */

  get project() {
    return this.#projector.project.bind(this.#projector);
  }

  get on() {
    return this.#projector.on.bind(this.#projector);
  }

  get once() {
    return this.#projector.once.bind(this.#projector);
  }

  get all() {
    return this.#projector.all.bind(this.#projector);
  }

  /*
   |--------------------------------------------------------------------------------
   | Collections
   |--------------------------------------------------------------------------------
   */

  get events() {
    return this.#db.collection("events");
  }

  /*
   |--------------------------------------------------------------------------------
   | Subscriber
   |--------------------------------------------------------------------------------
   */

  subscribeToInserts(callback: (next: { record: Record; hydrated: boolean }) => Promise<void>) {
    return this.#inserted.subscribe(callback);
  }

  subscribeToTenant(tenantId: string): RemoteSubscription {
    return this.#remote.subscribe("tenant", tenantId);
  }

  subscribeToStream(streamId: string): RemoteSubscription {
    return this.#remote.subscribe("stream", streamId);
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
   * @param tenant - Tenant the event belongs to.
   * @param stream - Stream the event belongs to.
   * @param event  - Event data to record.
   */
  async push<T extends Event["type"]>(
    tenant: string,
    stream: string,
    event: ExcludeEmptyFields<Extract<Event, { type: T }>>
  ) {
    if (this.#events.has((event as any).type) === false) {
      throw new Error(`Event '${(event as any).type}' is not registered with the event store!`);
    }
    const record = createEventRecord(tenant, stream, event as any);
    await this.insert(record as any, false);
  }

  /**
   * Insert a new event to the local event store database.
   *
   * @remarks This method triggers event validation and projection. If validation fails the event will
   * not be inserted. If the projection fails the projection itself should be handling the error based
   * on its own business logic.
   *
   * @remarks When hydration is true the event will be recorded with a new locally generated timestamp
   * as its being recorded locally but is not the originator of the event creation.
   *
   * @param record   - EventRecord to insert.
   * @param hydrated - Whether the event is hydrated or not. (Optional)
   */
  async insert(record: Record, hydrated = true): Promise<Record | undefined> {
    if (this.#events.has(record.type) === false) {
      return; // event record not supported by this event store
    }

    const status = await this.status(record);
    if (status.exists === true) {
      return record; // event already exists, no further actions required
    }

    if (hydrated === true) {
      record = {
        ...record,
        recorded: getTimestamp() // set locally recorded timestamp
      };
    }

    await this.validate(record);
    await this.events.insertOne(record as any);
    await this.project(record, { hydrated, outdated: status.outdated }).catch(console.log);

    console.debug(`Event '${record.type}' Appended\n${JSON.stringify(record, null, 2)}`);

    this.#inserted.next({ record, hydrated });

    return record;
  }

  /**
   * Retrieves events from the local ledger and projects them against the
   * running publisher instance.
   *
   * @param stream - Stream to hydrate. (Optional)
   * @param from   - Get events starting at a specific time position. (Optional)
   */
  async rehydrate(stream?: string, from?: string) {
    const events = stream ? await this.stream(stream, from) : await this.events.find({}, { sort: { created: 1 } });
    for (const event of events) {
      await this.project(event as any, { hydrated: true, outdated: false });
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
  async status({ id, stream, type, created }: Record): Promise<EventStatus> {
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
  async reduce<Reduce extends ReduceHandler>(stream: string, reduce: Reduce): Promise<ReturnType<Reduce> | undefined> {
    const events = await this.stream(stream);
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
   *
   * @param stream    - Stream to retrieve events for.
   * @param cursor    - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   */
  async stream(stream: string, cursor?: string, direction: 1 | -1 = 1) {
    const filter: any = { stream };
    if (cursor !== undefined) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: cursor
      };
    }
    return this.events.find(filter, { sort: { created: 1 } });
  }

  /**
   * Pull all events in order of locally recorded timestamp.
   *
   * @param stream - Stream to retrieve events for.
   * @param cursor - Get events from a specific point in time.
   */
  async pull(stream: string, cursor?: string) {
    const filter: any = { stream };
    if (cursor !== undefined) {
      filter.recorded = {
        $gt: cursor
      };
    }
    return this.events.find(filter, { sort: { recorded: 1 } });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ExcludeEmptyFields<T> = {
  [K in keyof T as T[K] extends Empty ? never : K]: T[K];
};
