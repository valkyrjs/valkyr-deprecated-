import path from "node:path";

export const ROOT_PATH = path
  .dirname(import.meta.url)
  .replace("file://", "")
  .replace("/dist/services", "");

export function getTemplatePath(template: string) {
  return getPath("templates", template);
}

export function getPath(...args: string[]) {
  return path.join(ROOT_PATH, ...args);
}

export function getRelativePath(...args: string[]) {
  return path.join(process.cwd(), ...args);
}
