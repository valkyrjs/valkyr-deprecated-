import tsParser from "prettier/parser-typescript";
import prettier from "prettier/standalone";

export function generateEvents(events: EventEntry[]): string {
  return prettier.format(
    [generateLedger(), generateEventsTypes(events), generateEventRecords(events.map((event) => event.type))].join("\n"),
    {
      parser: "typescript",
      plugins: [tsParser]
    }
  );
}

function generateLedger(): string {
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
  
  type EventToRecord<E> = E extends LedgerEvent ? EventRecord<E> : never;
  
  type Empty = Record<string, never>;
  `;
}

function generateEventsTypes(events: EventEntry[]): string {
  const result: string[] = [];
  for (const event of events) {
    const data = getEventRecord(event.data);
    const meta = getEventRecord(event.meta);
    if (data.length === 0 && meta.length === 0) {
      result.push(`type ${event.type} = LedgerEvent<"${event.type}">;`);
    }
    if (data.length > 0 && meta.length === 0) {
      result.push(`type ${event.type} = LedgerEvent<"${event.type}",\nRequired<{\n${data.join("\n")}\n}>\n>`);
    }
    if (data.length === 0 && meta.length > 0) {
      result.push(`type ${event.type} = LedgerEvent<"${event.type}",\n{},\nRequired<{\n${meta.join("\n")}\n}>\n>`);
    }
    if (data.length > 0 && meta.length > 0) {
      result.push(
        `type ${event.type} = LedgerEvent<"${event.type}",\nRequired<{\n${data.join(
          "\n"
        )}\n}>,\nRequired<{\n${meta.join("\n")}\n}>\n>`
      );
    }
    result.push("\n\n");
  }
  return result.join("");
}

function generateEventRecords(events: string[]): string {
  return `
  type EventRecord = ${events.map((name) => `LedgerEventRecord<${name}>`).join(" | ")};
  `;
}

function getEventRecord(record: DataRecord): string[] {
  const result = [];
  for (const key in record) {
    result.push(`${key}:${toType(record[key])};`);
  }
  return result;
}

export function toType(config: string): string {
  if (typeof config === "object" || Array.isArray(config)) {
    return "unknown";
  }
  const [origin, type, value] = config.split(":");
  switch (origin) {
    case "p": {
      return toPrimitiveType(type, value);
    }
    case "t": {
      return toCustomType(type);
    }
    default: {
      throw new Error(`Unknown type origin: ${origin}`);
    }
  }
}

function toPrimitiveType(type: string, value?: string): string {
  switch (type) {
    case "string": {
      if (value !== undefined) {
        return `"${value}"`;
      }
      return type;
    }
    case "number":
    case "boolean": {
      if (value !== undefined) {
        return value;
      }
      return type;
    }
    default: {
      throw new Error(`Unknown primitive type: ${type}`);
    }
  }
}

function toCustomType(type: string): string {
  return `Type.${type}`;
}

export type EventEntry = {
  type: string;
  data: DataRecord;
  meta: DataRecord;
};

export type ModuleEntry = {
  name: string;
  enabled: boolean;
  events: {
    alias: string;
    path: string;
  };
  dependencies: Record<string, string>;
};

type DataRecord = Record<string, string>;
