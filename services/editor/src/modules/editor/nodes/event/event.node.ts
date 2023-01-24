import { db } from "~services/database";
import { format } from "~services/prettier";
import { toType } from "~services/types";

export function addEventNode(): void {
  db.collection("nodes").insertOne({
    type: "event",
    position: { x: 0, y: 0 },
    data: {
      type: "event",
      config: {
        name: "FooCreated",
        data: [],
        meta: []
      },
      monaco: {
        model: format(`
          type FooCreated = LedgerEvent<"FooCreated">;
        `)
      }
    }
  });
}

export function getEventType(event: EventNodeData["config"]): string {
  const data = getEventRecord(event.data);
  const meta = getEventRecord(event.meta);
  if (data.length === 0 && meta.length === 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}">;`);
  }
  if (data.length > 0 && meta.length === 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}",Required<{${data.join("")}}>>`);
  }
  if (data.length === 0 && meta.length > 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}",{},Required<{${meta.join("")}}>>`);
  }
  if (data.length > 0 && meta.length > 0) {
    return format(
      `type ${event.name} = LedgerEvent<"${event.name}",Required<{${data.join("")}}>,Required<{${meta.join("")}}>>`
    );
  }
  return "";
}

export function generateLedger(): string {
  return `
  type LedgerEvent<Type extends string = string, Data extends {} = Empty, Meta extends {} = Empty> = {
    /**
     * Event identifier describing the intent of the event in a past tense format.
     */
    type: Type;
  
    /**
     * Stores the recorded partial piece of data that makes up a larger aggregate
     * state.
     */
    data: Data extends Empty ? {} : Data;
  
    /**
     * Stores additional meta data about the event that is not directly related
     * to the aggregate state.
     */
    meta: Meta extends Empty ? {} : Meta;
  };
  
  type LedgerEventStatus = {
    /**
     * Does the event already exist in the containing stream. This is an
     * optimization flag so that we can potentially ignore the processing of the
     * event if it already exists.
     */
    exists: boolean;
  
    /**
     * Is there another event in the stream of the same type that is newer than
     * the provided event. This is passed into projectors so that they can
     * route the event to the correct projection handlers.
     *
     * @see {@link Projection [once|on|all]}
     */
    outdated: boolean;
  };

  type LedgerEventRecord<E extends LedgerEvent = LedgerEvent> = {
    /**
     * A unique event identifier correlating its identity in the **event store**
     * _(database)_.
     */
    id: string;
  
    /**
     * Identifier representing the stream in which many individual events/transactions
     * belongs to and is used to generate a specific aggregate state representation of
     * that particular identity.
     */
    stream: string;
  
    /**
     * Event identifier describing the intent of the event in a past tense format.
     */
    type: E["type"];
  
    /**
     * Stores the recorded partial piece of data that makes up a larger aggregate
     * state.
     */
    data: E["data"];
  
    /**
     * Stores additional meta data about the event that is not directly related
     * to the aggregate state.
     */
    meta: E["meta"];
  
    /**
     * An immutable logical hybrid clock timestamp representing the wall time when
     * the event was created.
     *
     * This value is used to identify the date of its creation as well as a sorting
     * key when performing reduction logic to generate aggregate state for the stream
     * in which the event belongs.
     */
    created: string;
  
    /**
     * A mutable logical hybrid clock timestamps representing the wall time when the
     * event was recorded to the local **event ledger** _(database)_ as opposed to
     * when the event was actually created.
     *
     * This value is used when performing event synchronization between two different
     * event ledgers.
     */
    recorded: string;
  };
  
  type Empty = Record<string, never>;
  `;
}

export function generateEventRecords(events: string[]): string {
  if (events.length === 0) {
    return "";
  }
  return `type EventRecord = ${events.map((name) => `LedgerEventRecord<${name}>`).join(" | ")};`;
}

function getEventRecord(record: [string, string][]): string[] {
  const result = [];
  for (const [key, type] of record) {
    if (key === "") {
      continue; // do not add empty keys
    }
    result.push(`${key}:${toType(type)};`);
  }
  return result;
}

export type EventNodeData = {
  type: "event";
  config: {
    name: string;
    data: [string, string][];
    meta: [string, string][];
  };
  monaco: {
    model: string;
  };
};
