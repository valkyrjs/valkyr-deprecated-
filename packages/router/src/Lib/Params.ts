import type { Parameter } from "../Types/Params";
import { ValueStore } from "./ValueStore";

export function parseParams(path: string): Parameter[] {
  return path.split("/").reduce((list: Parameter[], next: string) => {
    if (next.match(/:/)) {
      list.push({
        name: next.replace(":", ""),
        value: undefined
      });
    }
    return list;
  }, []);
}

export function getParams(params: Parameter[], match: any): ValueStore {
  const result: any = {};
  params.forEach((param, index) => {
    result[param.name] = match[index + 1];
  });
  return new ValueStore(result);
}
