import { Controller } from "@valkyr/react";

import { closeModal } from "~components/modal";

import { addBlock, BlockType as Type } from "./blocks";

export class LibraryController extends Controller<{
  isOpen: boolean;
  blocks: BlockType[];
  templates: Template[];
}> {
  async onInit() {
    return {
      isOpen: false,
      blocks: [
        {
          name: "event",
          description: "Events are things...",
          add: this.#addBlocks(["event"])
        },
        {
          name: "reducer",
          description: "Reducers do things",
          add: this.#addBlocks(["reducer"])
        },
        {
          name: "type",
          description: "Types are things...",
          add: this.#addBlocks(["type"])
        },
        {
          name: "state",
          description: "State are things...",
          add: this.#addBlocks(["state"])
        }
      ],
      templates: [
        {
          name: "Basic Setup",
          description: "State, Reducer, 3 Event blocks",
          add: this.#addBlocks(["state", "type", "reducer", "event", "event", "event"])
        },
        {
          name: "Storytime",
          description: "A full application",
          add: this.#addBlocks(["state", "type", "reducer", "event", "event", "event"])
        }
      ]
    };
  }

  #addBlocks(blockTypes: Array<Type>): () => void {
    return async () => {
      for (const blockType of blockTypes) {
        addBlock(blockType);
      }
      closeModal();
    };
  }
}

export type BlockType = {
  name: Type;
  description: string;
  add: () => void;
};

export type Template = {
  name: string;
  description: string;
  add: () => void;
};
