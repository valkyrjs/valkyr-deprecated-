import { Controller } from "@valkyr/react";
import { Connection, Edge, Node, NodeChange, ReactFlowInstance } from "reactflow";

import { db } from "~services/database";
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
      edges: await this.query(db.collection("edges"), {}, async (documents, changed, type) => {
        switch (type) {
          case "insertOne":
          case "insertMany": {
            this.#instance?.addEdges(changed);
            break;
          }
          case "updateOne":
          case "updateMany": {
            this.#instance?.setEdges(documents);
            break;
          }
          case "remove": {
            this.#instance?.deleteElements({ edges: changed });
            break;
          }
        }
        // TODO: this will resize the view based on elements to ensure everything is visible.
        // setTimeout(() => this.#instance?.fitView(), 75);
        return {
          edges: documents
        };
      }),
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
        const { id, dimensions } = change;
        if (dimensions) {
          const { width, height } = dimensions;
          db.collection("nodes")
            .findOne({ id, height, width })
            .then((node) => {
              if (node === undefined) {
                db.collection("nodes").updateOne({ id }, { $set: { width, height } });
              }
            });
        }
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
