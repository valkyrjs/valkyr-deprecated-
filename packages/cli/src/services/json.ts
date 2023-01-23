import { readFile } from "./files.js";

export function getJSON<T>(path: string): T {
  return JSON.parse(readFile(path));
}
