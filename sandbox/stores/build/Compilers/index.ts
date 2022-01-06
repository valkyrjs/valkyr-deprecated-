import * as fs from "fs";
import * as path from "path";

import { getEventExports, getEventImports, getEvents } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | Stores
 |--------------------------------------------------------------------------------
 */

export async function stores(cwd: string) {
  const src = path.resolve(cwd);
  await writeStores(src, {
    output: await getOutput(src),
    access: await getAccess(src),
    events: await getEvents(src, src)
  });
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function getOutput(src: string) {
  const output: string[] = [];
  const dir = await fs.promises.opendir(src);
  for await (const dirent of dir) {
    const file = `${src}/${dirent.name}/index.ts`;
    if (dirent.isDirectory()) {
      try {
        await fs.promises.access(file);
        output.push(dirent.name);
      } catch (e) {
        // ignore failed access attempt
      }
    }
  }
  return output;
}

async function getAccess(src: string) {
  const access: Map<string, string> = new Map();
  const dir = await fs.promises.opendir(src);
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      access.set(dirent.name, `${src}/${dirent.name}`);
    }
  }
  return access;
}

/*
 |--------------------------------------------------------------------------------
 | Output
 |--------------------------------------------------------------------------------
 */

async function writeStores(src: string, { output, access, events }: any) {
  writeStoresMod(src, {
    output: getOutputExports(output),
    access: getAccessImports(src, access) + getAccessExports(access),
    events: getEventImports(events) + getEventExports(events)
  });
}

function writeStoresMod(cwd: string, output: any) {
  const exports = fs.readFileSync(path.join(process.cwd(), "build/Templates/index"), "utf-8");
  fs.writeFileSync(
    path.resolve(cwd, "index.ts"),
    exports
      .replace("$output", output.output)
      .replace("$access", output.access)
      .replace("$events", output.events)
      .replace("$stores", output.stores)
  );
}

function getAccessImports(src: string, stores: Map<string, string>) {
  let imports = "";
  for (const [store, path] of stores) {
    imports += `import ${store.toLowerCase()}Access from "${path.replace(src, ".")}/Access";\n`;
  }
  return imports + "\n";
}

function getOutputExports(stores: Map<string, string>) {
  const exports = [];
  for (const name of stores) {
    exports.push(`export * from "./${name}";`);
  }
  return exports.join("\n");
}

function getAccessExports(stores: Map<string, string>) {
  const exports = [];
  for (const [store] of stores) {
    exports.push(store.toLowerCase());
  }
  const print = [];
  print.push(`export const access = {\n  ${exports.map((key) => `${key}: ${key}Access`).join(",\n  ")}\n};`);
  return print.join("");
}
