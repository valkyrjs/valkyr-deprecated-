import { Controller } from "@valkyr/react";
import { NodeProps } from "reactflow";

import { ReducerBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { EdgeManager } from "../../Edges/Edge.Manager";

export class ReducerNodeController extends Controller<{}, NodeProps> {
  #edgeManager = new EdgeManager();

  async onInit() {
    this.subscriptions.set(
      "reducers",
      db.collection<ReducerBlock>("blocks").subscribe({ id: this.props.data.id }, { limit: 1 }, this.#connect)
    );
  }

  #connect = async (reducer?: ReducerBlock) => {
    if (reducer === undefined) {
      return this.#edgeManager.destroy();
    }
    await this.#edgeManager.load({
      root: reducer.id,
      inputs: {
        blockIds: reducer.events,
        onRemove: this.#removeEvent
      },
      outputs: {
        blockIds: reducer.state ? [reducer.state] : [],
        onRemove: this.#removeState
      }
    });
  };

  #removeEvent = (id: string) => {
    db.collection("blocks").updateOne({ id: this.props.data.id }, { $pull: { events: id } });
  };

  #removeState = () => {
    db.collection("blocks").updateOne({ id: this.props.data.id }, { $unset: { state: "" } });
  };
}
