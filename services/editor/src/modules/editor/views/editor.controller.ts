import { Controller } from "@valkyr/react";
import { Connection, Edge, Node, NodeChange, ReactFlowInstance } from "reactflow";

import { db } from "~services/database";

import { EventNode } from "../nodes/event/event.component";
import { ReducerNode } from "../nodes/reducer/reducer.component";
import { StateNode } from "../nodes/state/state.component";
import { TypeNode } from "../nodes/type/type.component";

export const nodeTypes = {
  event: EventNode,
  reducer: ReducerNode,
  state: StateNode,
  type: TypeNode
};

export class EditorController extends Controller<{
  nodes: Node[];
  edges: Edge[];
  asideOpen: boolean;
}> {
  #instance?: ReactFlowInstance;

  async onInit() {
    return {
      nodes: await this.query(db.collection("nodes"), {}, async (documents, changed, type) => {
        switch (type) {
          case "insertOne":
          case "insertMany": {
            this.#instance?.addNodes(changed);
            break;
          }
          case "updateOne":
          case "updateMany": {
            this.#instance?.setNodes(documents);
            break;
          }
          case "remove": {
            this.#instance?.deleteElements({ nodes: changed });
            break;
          }
        }
        // TODO: this will resize the view based on elements to ensure everything is visible.
        // setTimeout(() => this.#instance?.fitView(), 75);
        return {
          nodes: documents
        };
      }),
      edges: await db.collection("edges").find(),
      asideOpen: false
    };
  }

  setInstance(instance: ReactFlowInstance) {
    this.#instance = instance;
  }

  toggleAside(state: boolean) {
    this.setState("asideOpen", state);
  }

  onNodesChange(changes: NodeChange[]): void {
    changes.forEach((change) => {
      if (change.type === "dimensions") {
        db.collection("nodes").updateOne(
          { id: change.id },
          {
            $set: {
              width: change?.dimensions?.width,
              height: change?.dimensions?.height
            }
          }
        );
      }
    });
  }

  onNodePositionChanged(_: any, node: Node): void {
    db.collection("nodes")
      .findOne({
        id: node.id,
        position: node.position,
        positionAbsolute: node.positionAbsolute
      })
      .then((document) => {
        if (document === undefined) {
          db.collection("nodes").updateOne(
            {
              id: node.id
            },
            {
              $set: {
                position: node.position,
                positionAbsolute: node.positionAbsolute
              }
            }
          );
        }
      });
  }

  onConnect(connection: Connection): void {
    const { source, target } = connection;
    if (source !== null && target !== null) {
      db.collection("edges").insertOne({
        id: `reactflow__edge-${source}-${target}`,
        source,
        target
      });
    }
  }
}
