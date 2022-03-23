import camelcase from "camelcase";
import * as fs from "fs";

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export async function getAccess(src: string) {
  const access: Map<string, string> = new Map();
  const dir = await fs.promises.opendir(src);
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const storePath = `${src}/${dirent.name}`;
      const store = await fs.promises.readdir(storePath);
      if (store.includes("Access.ts")) {
        access.set(dirent.name, storePath);
      }
    }
  }
  return access;
}

export function getAccessImports(src: string, stores: Map<string, string>) {
  let imports = "";
  for (const [store, path] of getSortedStores(stores)) {
    imports += `import { access as ${camelcase(store)}Access } from "${path.replace(src, ".")}/Access";\n`;
  }
  return imports + "\n";
}

export function getAccessExports(stores: Map<string, string>) {
  const exports = [];
  for (const [store] of getSortedStores(stores)) {
    exports.push(camelcase(store));
  }
  const print = [];
  print.push(`export const access = {\n  ${exports.map((key) => `${key}: ${key}Access`).join(",\n  ")}\n};`);
  return print.join("");
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getSortedStores(stores: Map<string, string>): [string, string][] {
  const list: string[] = [];
  for (const [store] of stores) {
    list.push(store);
  }
  return list.sort().map((store) => {
    const path = stores.get(store);
    if (path === undefined) {
      throw new Error(`Access Build Violation: Could not retrieve path from '${store}' store`);
    }
    return [store, path];
  });
}
