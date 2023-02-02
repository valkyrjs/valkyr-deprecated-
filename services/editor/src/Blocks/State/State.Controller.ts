import { Controller } from "@valkyr/react";

import { StateBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { BlockFields } from "../BlockFields";

export class StateNodeController extends Controller<
  {
    block?: StateBlock;
    data: BlockFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(db.collection<StateBlock>("blocks"), { where: { id: this.props.id }, limit: 1 }, "block"),
      data: new BlockFields("blocks", this.props.id, "data")
    };
  }

  setName(name: string) {
    db.collection("blocks").updateOne(
      { id: this.props.id },
      {
        $set: { name }
      }
    );
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
