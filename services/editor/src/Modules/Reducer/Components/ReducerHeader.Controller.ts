import { Controller } from "@valkyr/react";

import { StateBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export class ReducerHeaderController extends Controller<
  {
    name: string;
  },
  {
    stateId?: string;
    open: boolean;
    onRemove: () => void;
  }
> {
  async onResolve() {
    if (this.props.stateId === undefined) {
      return { name: "Reducer" };
    }
    await this.query(
      db.collection<StateBlock>("blocks"),
      { where: { id: this.props.stateId }, limit: 1 },
      async (state) => ({
        name: this.#getName(state)
      })
    );
  }

  #getName(state?: StateBlock): string {
    if (state !== undefined) {
      return `${state.name} Reducer`;
    }
    return "Reducer";
  }
}
