import { Subject } from "rxjs";

import { db } from "~Services/Database";

export const edges = new Subject<EdgeAction>();

export function addEdge(source: string, target: string, data: EdgeData = {}) {
  db.collection("nodes")
    .findOne({ "data.id": source })
    .then((node) => {
      if (node !== undefined) {
        edges.next({
          type: "add",
          edge: {
            id: `${source}-${target}`,
            type: "block",
            source: node.id,
            target,
            data
          }
        });
      }
    });
}

export function removeEdge(source: string, target: string) {
  edges.next({ type: "remove", id: `${source}-${target}` });
}

type EdgeAction =
  | {
      type: "add";
      edge: {
        id: string;
        type: string;
        source: string;
        target: string;
        data: EdgeData;
      };
    }
  | {
      type: "remove";
      id: string;
    };

type EdgeData = {
  stroke?: string;
  onRemove?: () => void;
};
