import { readFile } from "./files";

export function getJSON<T>(path: string): T {
  return JSON.parse(readFile(path));
}
