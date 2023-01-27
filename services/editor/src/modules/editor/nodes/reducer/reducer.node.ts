import { format } from "~services/prettier";

export function getReducerData(): ReducerData {
  return {
    name: "reducer",
    value: format(`
      async function reduce(state: State, event: EventRecord): Promise<State> {
        // write your reducer logic here ...
      };
    `)
  };
}

export type ReducerData = {
  name: string;
  value: string;
};
