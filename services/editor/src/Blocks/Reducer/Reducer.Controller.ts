import { Controller } from "@valkyr/react";

import { ReducerBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export class ReducerNodeController extends Controller<
  {
    block?: ReducerBlock;
  },
  {
    id: string;
  }
> {
  async onInit() {
    return {
      block: await this.query(
        db.collection<ReducerBlock>("blocks"),
        { where: { id: this.props.id }, limit: 1 },
        "block"
      )
    };
  }

  onChange(value: string) {
    db.collection<ReducerBlock>("blocks").updateOne({ id: this.props.id }, { $set: { value } });
  }

  async onRemove() {
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
