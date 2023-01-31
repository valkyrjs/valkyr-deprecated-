import prettier from "prettier";

import { ModuleEntry } from "../services/modules.js";
import { toType } from "../services/types.js";
import { getGeneratedHeader } from "./shared.js";

export function generateEvents(events: EventEntry[], modules: ModuleEntry[]): string {
  const eventNames: string[] = events.map((event) => event.type);
  const moduleEvents: string[] = modules.reduce((modules: string[], module) => {
    if (module.events !== undefined) {
      modules.push(module.events.alias);
    }
    return modules;
  }, []);
  return prettier.format(
    [
      getGeneratedHeader("events"),
      generateImports(modules),
      generateFactories(eventNames, moduleEvents),
      generateEventsTypes(events),
      generateEventRecords(eventNames, moduleEvents)
    ].join("\n"),
    {
      parser: "typescript",
      printWidth: 80,
      trailingComma: "none"
    }
  );
}

function generateImports(modules: ModuleEntry[]): string {
  const imports = [
    {
      alias: "Type",
      path: "./types"
    },
    ...modules.map(({ name, events }) => ({
      alias: events.alias,
      path: `../modules/${name}/${events.path}`
    }))
  ];
  return `
  import * as Ledger from "@valkyr/ledger";

  ${imports
    .sort((a, b) => (a.path > b.path ? 1 : -1))
    .map((m) => `import * as ${m.alias} from "${m.path}";`)
    .join("\n")}
  `;
}

function generateFactories(events: string[], modules: string[]): string {
  return `
  export const event = {
    ${events.map((name) => `${toCamelCase(name)}: Ledger.makeEvent<${name}>("${name}")`).join(",\n")}
    ${modules.length > 0 ? `,...${modules.map((alias) => `${alias}.event`)}` : ""}
  } as const;

  export type EventFactory = typeof event;
  `;
}

function generateEventsTypes(events: EventEntry[]): string {
  const result: string[] = [];
  for (const event of events) {
    const data = getEventRecord(event.data);
    const meta = getEventRecord(event.meta);
    if (data.length === 0 && meta.length === 0) {
      result.push(`export type ${event.type} = Ledger.Event<"${event.type}">;`);
    }
    if (data.length > 0 && meta.length === 0) {
      result.push(`export type ${event.type} = Ledger.Event<"${event.type}",\nRequired<{\n${data.join("\n")}\n}>\n>`);
    }
    if (data.length === 0 && meta.length > 0) {
      result.push(
        `export type ${event.type} = Ledger.Event<"${event.type}",\n{},\nRequired<{\n${meta.join("\n")}\n}>\n>`
      );
    }
    if (data.length > 0 && meta.length > 0) {
      result.push(
        `export type ${event.type} = Ledger.Event<"${event.type}",\nRequired<{\n${data.join(
          "\n"
        )}\n}>,\nRequired<{\n${meta.join("\n")}\n}>\n>`
      );
    }
    result.push("\n\n");
  }
  return result.join("");
}

function generateEventRecords(events: string[], modules: string[]): string {
  return `
  export type EventRecord = ${events.map((name) => `Ledger.EventRecord<${name}>`).join(" | ")}${
    modules.length > 0 ? ` | ${modules.map((alias) => `${alias}.EventRecord`).join(" | ")}` : ""
  };
  `;
}

function getEventRecord(record: DataRecord): string[] {
  const result = [];
  for (const key in record) {
    result.push(`${key}:${toType(record[key])};`);
  }
  return result;
}

function toCamelCase(str: string): string {
  return str[0].toLowerCase() + str.slice(1);
}

export type EventEntry = {
  type: string;
  data: DataRecord;
  meta: DataRecord;
};

type DataRecord = Record<string, string>;
