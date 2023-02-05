import { Controller } from "@valkyr/react";
import { NodeProps } from "reactflow";

import { ValidatorBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { EdgeManager } from "../../Edges/Edge.Manager";

export class ValidatorNodeController extends Controller<{}, NodeProps> {
  #edgeManager = new EdgeManager();

  async onInit() {
    this.subscriptions.set(
      "validators",
      db.collection<ValidatorBlock>("blocks").subscribe({ id: this.props.data.id }, { limit: 1 }, this.#connect)
    );
  }

  #connect = async (validator?: ValidatorBlock) => {
    if (validator === undefined) {
      return this.#edgeManager.destroy();
    }
    const blockIds: Record<string, "context" | "event"> = {};
    for (const { blockId } of validator.context) {
      blockIds[blockId] = "context";
    }
    if (validator.event !== undefined) {
      blockIds[validator.event] = "event";
    }
    await this.#edgeManager.load({
      root: validator.id,
      inputs: {
        blockIds,
        onRemove: () => {}
      }
    });
  };
}
