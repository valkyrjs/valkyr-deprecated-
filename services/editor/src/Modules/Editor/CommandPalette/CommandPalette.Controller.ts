import { Controller } from "@valkyr/react";

import { addBlock, BlockType } from "~Blocks/Block.Collection";
import { closeModal } from "~Components/Modal";
import { addNode } from "~ReactFlow/Data/Node.Collection";
import { NodeType, nodeTypes } from "~ReactFlow/Nodes/Node.Types";

export class CommandPaletteController extends Controller<{
  isOpen: boolean;
  actions: Action[];
  query: string;
  recent: string; // Block Name
  blocks: any[]; // All Blocks
}> {
  async onInit() {
    return {
      isOpen: false,
      query: "",
      recent: "",
      blocks: [],
      actions: [
        {
          name: "Add new Event...",
          icon: "text-orange border-orange",
          shortcut: "E",
          add: this.#buildAdd([
            { type: "event", defaults: { name: "TaskAdded", data: [["name", "p:string"]], meta: [] } }
          ])
        },
        {
          name: "Add new Reducer...",
          icon: "text-cyan border-cyan",
          shortcut: "R",
          add: this.#buildAdd([{ type: "reducer", defaults: { name: "TaskReducer" } }])
        },
        {
          name: "Add new State...",
          icon: "text-pink border-pink",
          shortcut: "S",
          add: this.#buildAdd([{ type: "state", defaults: { name: "Task", data: [["name", "p:string"]] } }])
        },
        {
          name: "Add new Type...",
          icon: "text-green border-green",
          shortcut: "T",
          add: this.#buildAdd([{ type: "type", defaults: { name: "TaskState", data: [["done", "p:string"]] } }])
        }
      ]
    };
  }

  setQuery(query: string) {
    this.setState("query", query);
  }

  #buildAdd(insertions: BlockInsertion[]): () => void {
    return async () => {
      for (const insert of insertions) {
        const blockId = await addBlock(insert.type, insert.defaults);
        if (nodeTypes[insert.type] !== undefined) {
          addNode(insert.type as NodeType, blockId);
        }
      }
      closeModal();
    };
  }
}

type BlockInsertion = {
  type: BlockType;
  defaults: any;
};

type Action = {
  name: BlockType;
  description: string;
  icon: string;
  shortcut: string;
  add: () => void;
};
