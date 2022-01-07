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
      access.set(dirent.name, `${src}/${dirent.name}`);
    }
  }
  return access;
}

export function getAccessImports(src: string, stores: Map<string, string>) {
  let imports = "";
  for (const [store, path] of stores) {
    imports += `import { access as ${store.toLowerCase()}Access } from "${path.replace(src, ".")}/Access";\n`;
  }
  return imports + "\n";
}

export function getAccessExports(stores: Map<string, string>) {
  const exports = [];
  for (const [store] of stores) {
    exports.push(store.toLowerCase());
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

function getSortedPaths(map: any) {
  const paths = [];
  for (const event in map) {
    paths.push([event, map[event]]);
  }
  return paths.sort((a, b) => (a[1] > b[1] ? 1 : -1));
}

function lower(str: string): string {
  return str.charAt(0).toLocaleLowerCase() + str.slice(1);
}
