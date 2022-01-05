import * as fs from "fs";

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export async function getAccess(path: string, root: string, events: Record<string, unknown> = {}) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    if (dirent.isFile() && path.includes("Access")) {
      events[lower(dirent.name.replace(".ts", ""))] = `${path}/${dirent.name}`.replace(root, ".").replace(".ts", "");
    }
    if (dirent.isDirectory()) {
      await getAccess(`${path}/${dirent.name}`, root, events);
    }
  }
  return events;
}

export function getAccessImports(list: any) {
  const imports: string[] = [];
  for (const [action, path] of getSortedPaths(list)) {
    imports.push(`export { ${action} } from "${path}";`);
  }
  return imports.join("\n");
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
