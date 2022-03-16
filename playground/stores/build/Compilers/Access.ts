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
