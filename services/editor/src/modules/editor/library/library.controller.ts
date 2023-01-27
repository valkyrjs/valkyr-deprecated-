import { Controller } from "@valkyr/react";

import { closeModal } from "~components/modal";
import { db } from "~services/database";

import { getNode, NodeType } from "./nodes";

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
          name: "validator",
          description: "Validators validate events",
          add: this.#addBlocks(["validator"])
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

  #addBlocks(blockTypes: Array<NodeType>): () => void {
    return async () => {
      const nodes = [];
      for (const blockType of blockTypes) {
        nodes.push(await getNode(blockType));
      }
      db.collection("nodes").insertMany(nodes);
      closeModal();
    };
  }
}

export type BlockType = {
  name: string;
  description: string;
  add: () => void;
};

export type Template = {
  name: string;
  description: string;
  add: () => void;
};
