import { Controller } from "@valkyr/react";

import { closeModal } from "~Components/Modal";

export class LibraryController extends Controller<{
  isOpen: boolean;
  blocks: Block[];
  services: Block[];
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
            { type: "event", defaults: { name: "EventName", data: [["name", "p:string"]], meta: [] } }
          ])
        },
        {
          type: "reducer",
          description: "Reducers do things",
          add: this.#buildAdd([{ type: "reducer" }])
        },
        {
          type: "validator",
          description: "Validators validate things",
          add: this.#buildAdd([{ type: "validator" }])
        },
        {
          type: "type",
          description: "Types are things...",
          add: this.#buildAdd([{ type: "type" }])
        },
        {
          type: "state",
          description: "State are things...",
          add: this.#buildAdd([{ type: "state", defaults: { name: "StateName", data: [["name", "p:string"]] } }])
        }
      ],
      services: [
        {
          type: "database",
          description: "Database store stuff...",
          add: this.#buildAdd([{ type: "database" }])
        }
      ],
      templates: [
        {
          name: "Simple ToDo",
          description: "Obligatory Todo Sample",
          add: async () => {
            /*
            const e1 = await addBlock("event", { name: "TaskAdded", data: [["name", "p:string"]], meta: [] });
            await addNode("event", e1);
            const e2 = await addBlock("event", { name: "TaskStateChanged", data: [["state", "p:boolean"]], meta: [] });
            await addNode("event", e2);
            const e3 = await addBlock("event", { name: "TaskDeleted", data: [], meta: [] });
            await addNode("event", e3);
            const s1 = await addBlock("state", {
              name: "Task",
              data: [
                ["name", "p:string"],
                ["state", "p:string"]
              ]
            });
            await addNode("state", s1);
            const r1 = await addBlock("reducer", { name: "TaskReducer", events: [e1, e2, e3], state: s1 });
            await addNode("reducer", r1);
            */
            closeModal();
          }
        }
      ]
    };
  }

  #buildAdd(_: BlockInsertion[]): () => void {
    return async () => {
      /*
      for (const insert of insertions) {
        const blockId = await addBlock(insert.type, insert.defaults);
        if (nodeTypes[insert.type] !== undefined) {
          addNode(insert.type, blockId);
        }
      }
      */
      closeModal();
    };
  }
}

type BlockInsertion = {
  type: string;
  defaults?: any;
};

type Block = {
  type: string;
  description: string;
  add: () => void;
};

type Template = {
  name: string;
  description: string;
  add: () => void;
};