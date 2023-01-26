import { Controller } from "@valkyr/react";

import { closeModal } from "~components/modal";

import { addEventNode } from "../nodes/event/event.node";
import { addReducerNode } from "../nodes/reducer/reducer.node";
import { addStateNode } from "../nodes/state/state.node";
import { addTypeNode } from "../nodes/type/type.node";

export class LibraryController extends Controller<{
  isOpen: boolean;
  blocks: BlockType[];
}> {
  async onInit() {
    return {
      isOpen: false,
      blocks: [
        {
          name: "event",
          description: "Events are things...",
          add: this.#addBlock(addEventNode)
        },
        {
          name: "reducer",
          description: "Reducers do things",
          add: this.#addBlock(addReducerNode)
        },
        {
          name: "type",
          description: "Types are things...",
          add: this.#addBlock(addTypeNode)
        },
        {
          name: "state",
          description: "State are things...",
          add: this.#addBlock(addStateNode)
        }
      ]
    };
  }

  #addBlock(addNode: () => void): () => void {
    return () => {
      addNode();
      closeModal();
    };
  }
}

export type BlockType = {
  name: string;
  description: string;
  add: () => void;
};
