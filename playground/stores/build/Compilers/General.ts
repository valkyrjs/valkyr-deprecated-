import * as fs from "fs";

export async function getGeneral(src: string) {
  const output: string[] = [];
  const dir = await fs.promises.opendir(src);
  for await (const dirent of dir) {
    const file = `${src}/${dirent.name}/index.ts`;
    if (dirent.isDirectory()) {
      try {
        await fs.promises.access(file);
        output.push(dirent.name);
      } catch (e) {
        // ignore missing index.ts files as they are optional
      }
    }
  }
  return output;
}

export function getGeneralExports(stores: string[]) {
  const exports = [];
  for (const name of stores) {
    exports.push(`export * from "./${name}";`);
  }
  return exports.join("\n");
}
