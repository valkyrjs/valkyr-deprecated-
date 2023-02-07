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
    if (settings.inputs !== undefined) {
      await this.#setInputBlocks(settings.inputs.blockIds, settings.inputs.onRemove);
    }
    if (settings.outputs !== undefined) {
      await this.#setOutputBlocks(settings.outputs.blockIds, settings.outputs.onRemove);
    }
  }

  async #setRootBlock(blockId: string): Promise<this> {
    const node = await db.collection("nodes").findOne({ "data.blockId": blockId });
    if (node === undefined) {
      throw new Error(`Required node missing for root block ${blockId}`);
    }
    this.#sourceNode = node;
    return this;
  }

  async #setInputBlocks(blockIds: BlockIds, onRemove: OnRemove): Promise<this> {
    this.#inputNodes = await db.collection("nodes").find({ "data.blockId": { $in: Object.keys(blockIds) } });
    for (const node of this.#inputNodes) {
      this.#addEdge(node, this.sourceNode, blockIds[node.data.blockId], () => {
        onRemove(node.data.blockId, node.type);
      });
    }
    return this;
  }

  async #setOutputBlocks(blockIds: BlockIds, onRemove: OnRemove): Promise<this> {
    this.#outputNodes = await db.collection("nodes").find({ "data.blockId": { $in: Object.keys(blockIds) } });
    for (const node of this.#outputNodes) {
      this.#addEdge(this.sourceNode, node, blockIds[node.data.blockId], () => {
        onRemove(node.data.blockId, node.type);
      });
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Connectors
   |--------------------------------------------------------------------------------
   */

  async #addEdge(sourceNode: Node, targetNode: Node, targetHandle: string | undefined, onRemove: () => void) {
    edges.next({
      type: "add",
      edge: {
        id: `${sourceNode.id}-${targetNode.id}`,
        source: sourceNode.id,
        target: targetNode.id,
        targetHandle,
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
  inputs?: Connections;
  outputs?: Connections;
};

type Connections = {
  blockIds: BlockIds;
  onRemove: OnRemove;
};

type BlockIds = Record<string, string | undefined>;

type OnRemove = (blockId: string, nodeType?: string) => Promise<void> | void;
