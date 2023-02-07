import { Controller } from "@valkyr/react";
import { NodeProps } from "reactflow";

import { ReducerBlock } from "~Blocks/Block.Collection";
import { EdgeManager } from "~ReactFlow/Edges/Edge.Manager";
import { db } from "~Services/Database";

export class ReducerNodeController extends Controller<{}, NodeProps> {
  #edgeManager = new EdgeManager();

  async onInit() {
    this.subscriptions.set(
      "reducers",
      db.collection<ReducerBlock>("blocks").subscribe({ id: this.props.data.blockId }, { limit: 1 }, this.#connect)
    );
  }

  #connect = async (reducer?: ReducerBlock) => {
    if (reducer === undefined) {
      return this.#edgeManager.destroy();
    }
    await this.#edgeManager.load({
      root: reducer.id,
      inputs: {
        blockIds: this.#getInputBlockIds(reducer.events),
        onRemove: this.#removeEvent
      },
      outputs: {
        blockIds: this.#getOutputBlockIds(reducer.state),
        onRemove: this.#removeState
      }
    });
  };

  #getInputBlockIds(eventIds: string[]) {
    const blockIds: Record<string, "events"> = {};
    for (const eventId of eventIds) {
      blockIds[eventId] = "events";
    }
    return blockIds;
  }

  #getOutputBlockIds(stateId?: string) {
    if (stateId === undefined) {
      return {};
    }
    return { [stateId]: "state" };
  }

  #removeEvent = (id: string) => {
    db.collection("blocks").updateOne({ id: this.props.data.blockId }, { $pull: { events: id } });
  };

  #removeState = () => {
    db.collection("blocks").updateOne({ id: this.props.data.blockId }, { $unset: { state: "" } });
  };
}
