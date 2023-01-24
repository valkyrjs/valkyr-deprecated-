import { Controller } from "@valkyr/react";

import { closeModal } from "~components/modal";
import { db } from "~services/database";

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
          description: "Events are things..."
        },
        {
          name: "reducer",
          description: "Reducers do things"
        }
      ]
    };
  }

  async addBlock(block: BlockType) {
    const node = { type: block.name, position: { x: 0, y: 0 }, data: {} };
    await db.collection("nodes").insertOne(node);
    closeModal();
  }
}

type BlockType = {
  name: string;
  description: string;
};
