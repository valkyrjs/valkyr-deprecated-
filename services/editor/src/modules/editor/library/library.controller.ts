import { Controller } from "@valkyr/react";

import { closeModal } from "~components/modal";
import { db } from "~services/database";

import { getEventData } from "../nodes/event/event.node";
import { getPosition } from "../nodes/node.utils";
import { getReducerData } from "../nodes/reducer/reducer.node";
import { getStateData } from "../nodes/state/state.node";
import { getTypeData } from "../nodes/type/type.node";

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

  #addBlocks(blockTypes: Array<string>): () => void {
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

async function getNode(type: string) {
  switch (type) {
    case "type": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getTypeData()
      };
    }
    case "reducer": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getReducerData()
      };
    }
    case "state": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getStateData()
      };
    }
    case "event":
    default: {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getEventData("AccountCreated", [
          ["email", "p:string"],
          ["password", "p:string"]
        ])
      };
    }
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
