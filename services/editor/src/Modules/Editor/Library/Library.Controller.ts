import { Controller } from "@valkyr/react";

import { addBlock, BlockType } from "~Blocks/Utilities";
import { closeModal } from "~Components/Modal";

import { nodeTypes } from "../Nodes";
import { addEditorNode } from "../Nodes/Node.Collection";
import { NodeType } from "../Nodes/Node.Types";

export class LibraryController extends Controller<{
  isOpen: boolean;
  blocks: Block[];
  templates: Template[];
}> {
  async onInit() {
    return {
      isOpen: false,
      blocks: [
        {
          type: "event",
          description: "Events are things...",
          add: this.#buildAdd([
            { type: "event", defaults: { name: "TaskAdded", data: [["name", "p:string"]], meta: [] } }
          ])
        },
        {
          type: "reducer",
          description: "Reducers do things",
          add: this.#buildAdd([{ type: "reducer", defaults: { name: "TaskReducer" } }])
        },
        {
          type: "type",
          description: "Types are things...",
          add: this.#buildAdd([{ type: "type", defaults: { name: "TaskState", data: [["done", "p:string"]] } }])
        },
        {
          type: "state",
          description: "State are things...",
          add: this.#buildAdd([{ type: "state", defaults: { name: "Task", data: [["name", "p:string"]] } }])
        }
      ],
      templates: [
        {
          name: "Simple ToDo",
          description: "Obligatory Todo Sample",
          add: async () => {
            const e1 = await addBlock("event", { name: "TaskAdded", data: [["name", "p:string"]], meta: [] });
            const e2 = await addBlock("event", { name: "TaskStateChanged", data: [["state", "p:boolean"]], meta: [] });
            const e3 = await addBlock("event", { name: "TaskDeleted", data: [], meta: [] });
            const s1 = await addBlock("state", {
              name: "Task",
              data: [
                ["name", "p:string"],
                ["state", "p:string"]
              ]
            });
            await addBlock("reducer", { name: "TaskReducer", events: [e1, e2, e3], state: s1 });
            closeModal();
          }
        }
      ]
    };
  }

  #buildAdd(insertions: BlockInsertion[]): () => void {
    return async () => {
      for (const insert of insertions) {
        const blockId = await addBlock(insert.type, insert.defaults);
        if ((nodeTypes as any)[insert.type] !== undefined) {
          addEditorNode(insert.type as NodeType, blockId);
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

type Block = {
  type: BlockType;
  description: string;
  add: () => void;
};

type Template = {
  name: string;
  description: string;
  add: () => void;
};
