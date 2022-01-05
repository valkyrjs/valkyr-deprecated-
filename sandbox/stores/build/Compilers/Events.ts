import * as fs from "fs";

const EXPORT_REGEX = /export type [a-zA-Z]+/gm;

type EventMap = Record<string, EventCompilation>;
type EventCompilation = {
  path: string;
  events: string[];
};

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export async function getEvents(path: string, root: string, events: EventMap = {}) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name === "Events.ts") {
      events[path.replace(root + "/", "")] = {
        path: `${path}/${dirent.name}`.replace(root, ".").replace(".ts", ""),
        events: getExports(path + "/" + dirent.name)
      };
    }
    if (dirent.isDirectory()) {
      await getEvents(`${path}/${dirent.name}`, root, events);
    }
  }
  return events;
}

export function getEventImports(events: EventMap) {
  let imports = "";
  for (const key in events) {
    const entry = events[key];
    imports += `import { ${entry.events.join(", ")} } from "${entry.path}";\n`;
  }
  return imports + "\n";
}

export function getEventExports(events: EventMap) {
  let exports: string[] = [];
  for (const key in events) {
    exports = exports.concat(events[key].events);
  }
  return getExportPrint(exports);
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getExports(path: string) {
  const content = fs.readFileSync(path).toString("utf8");
  const lines = content.split("\n");
  const output = [];
  for (const line of lines) {
    if (line.match(EXPORT_REGEX)) {
      output.push(line.split(" ")[2]);
    }
  }
  return output;
}

function getExportPrint(events: any) {
  const print = [];

  print.push(`export type Event =\n  | ${events.join("\n  | ")};\n\n`);
  print.push(`export {\n  ${events.join(",\n  ")}\n};`);

  return print.join("");
}
