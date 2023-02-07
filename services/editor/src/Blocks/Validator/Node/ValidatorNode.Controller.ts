import { Controller } from "@valkyr/react";
import { NodeProps } from "reactflow";

import { ValidatorBlock } from "~Blocks/Block.Collection";
import { EdgeManager } from "~ReactFlow/Edges/Edge.Manager";
import { db } from "~Services/Database";

export class ValidatorNodeController extends Controller<{}, NodeProps> {
  #edgeManager = new EdgeManager();

  async onInit() {
    this.subscriptions.set(
      "validators",
      db.collection<ValidatorBlock>("blocks").subscribe({ id: this.props.data.blockId }, { limit: 1 }, this.#connect)
    );
  }

  #connect = async (validator?: ValidatorBlock) => {
    if (validator === undefined) {
      return this.#edgeManager.destroy();
    }
    const blockIds: Record<string, "context" | "event"> = {};
    for (const blockId of validator.context) {
      blockIds[blockId] = "context";
    }
    if (validator.event !== undefined) {
      blockIds[validator.event] = "event";
    }
    await this.#edgeManager.load({
      root: validator.id,
      inputs: {
        blockIds,
        onRemove: (blockId, nodeType) => {
          if (nodeType === "event") {
            db.collection<ValidatorBlock>("blocks").updateOne({ id: validator.id }, { $unset: { event: undefined } });
          } else {
            db.collection<ValidatorBlock>("blocks").updateOne(
              { id: validator.id },
              { $pull: { context: { blockId } } }
            );
          }
        }
      }
    });
  };
}
