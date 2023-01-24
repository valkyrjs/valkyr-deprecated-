import { db } from "~services/database";
import { format } from "~services/prettier";

export function addReducerNode(): void {
  db.collection("nodes").insertOne({
    type: "reducer",
    position: { x: 0, y: 0 },
    data: {
      type: "reducer",
      config: {
        events: [],
        code: format(`
        async function reduce(state: State, event: EventRecord): Promise<State> {
          switch (event.type) {
            default: {
              return state;
            }
          }
        };
        `)
      }
    }
  });
}

export type ReducerNodeData = {
  type: "reducer";
  config: {
    events: string[];
    state?: string;
    code: string;
  };
};
