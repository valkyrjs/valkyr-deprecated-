import { Edge, Node } from "reactflow";
import { Subject } from "rxjs";

import { db } from "~Services/Database";

export const edges = new Subject<EdgeAction>();

export class EdgeManager {
  #sourceNode?: Node;
  #inputNodes: Node[] = [];
  #outputNodes: Node[] = [];

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get sourceNode() {
    if (this.#sourceNode === undefined) {
      throw new Error("Source node not set");
    }
    return this.#sourceNode;
  }

  get inputNodes() {
    return this.#inputNodes;
  }

  get outputNodes() {
    return this.#outputNodes;
  }

  /*
   |--------------------------------------------------------------------------------
   | I/O Handlers
   |--------------------------------------------------------------------------------
   */

  async load(settings: ConnectionSettings) {
    this.destroy();
    await this.#setRootBlock(settings.root);
    await this.#setInputBlocks(settings.inputs.blockIds, settings.inputs.onRemove);
    await this.#setOutputBlocks(settings.outputs.blockIds, settings.outputs.onRemove);
  }

  async #setRootBlock(blockId: string): Promise<this> {
    const node = await db.collection("nodes").findOne({ "data.id": blockId });
    if (node === undefined) {
      throw new Error(`Required node missing for root block ${blockId}`);
    }
    this.#sourceNode = node;
    return this;
  }

  async #setInputBlocks(blockIds: string[], onRemove: OnRemove): Promise<this> {
    this.#inputNodes = await db.collection("nodes").find({ "data.id": { $in: blockIds } });
    for (const node of this.#inputNodes) {
      this.#addEdge(node, this.sourceNode, () => {
        onRemove(node.data.id);
      });
    }
    return this;
  }

  async #setOutputBlocks(blockIds: string[], onRemove: OnRemove): Promise<this> {
    this.#outputNodes = await db.collection("nodes").find({ "data.id": { $in: blockIds } });
    for (const node of this.#outputNodes) {
      this.#addEdge(this.sourceNode, node, () => {
        onRemove(node.data.id);
      });
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Connectors
   |--------------------------------------------------------------------------------
   */

  async #addEdge(sourceNode: Node, targetNode: Node, onRemove: () => void) {
    edges.next({
      type: "add",
      edge: {
        id: `${sourceNode.id}-${targetNode.id}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: "block",
        data: {
          sourceType: sourceNode.type,
          onRemove: () => {
            this.#removeEdge(sourceNode.id, targetNode.id);
            onRemove();
          }
        }
      }
    });
  }

  #removeEdge(source: string, target: string) {
    edges.next({ type: "remove", id: `${source}-${target}` });
  }

  /*
   |--------------------------------------------------------------------------------
   | Destructor
   |--------------------------------------------------------------------------------
   */

  destroy() {
    for (const node of this.#inputNodes) {
      this.#removeEdge(node.id, this.sourceNode.id);
    }
    for (const node of this.#outputNodes) {
      this.#removeEdge(this.sourceNode.id, node.id);
    }
  }
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
  sourceType?: string;
  onRemove?: () => void;
};

type ConnectionSettings = {
  root: string;
  inputs: Connections;
  outputs: Connections;
};

type Connections = {
  blockIds: string[];
  onRemove: OnRemove;
};

type OnRemove = (id: string) => Promise<void> | void;
