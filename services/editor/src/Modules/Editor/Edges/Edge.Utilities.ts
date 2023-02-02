import { Edge } from "reactflow";
import { Subject } from "rxjs";

import { BlockType } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export const edges = new Subject<EdgeAction>();

export function addEdge(edge: Omit<Edge<EdgeData>, "id">, data: EdgeData = {}) {
  db.collection("nodes")
    .findOne({ "data.id": edge.source })
    .then((node) => {
      if (node !== undefined) {
        edges.next({
          type: "add",
          edge: {
            ...edge,
            id: `${node.id}-${edge.target}`,
            source: node.id,
            type: "block",
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
      edge: Edge<EdgeData>;
    }
  | {
      type: "remove";
      id: string;
    };

type EdgeData = {
  sourceType?: BlockType;
  onRemove?: () => void;
};
