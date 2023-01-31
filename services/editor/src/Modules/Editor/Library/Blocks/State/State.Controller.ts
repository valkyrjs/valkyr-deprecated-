import { Controller } from "@valkyr/react";

import { db } from "~Services/Database";

import { BlockFields } from "../../Utilities/BlockFields";
import { StateBlock } from "./State.Collection";

export class StateNodeController extends Controller<
  {
    block?: StateBlock;
    data: BlockFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(db.collection("states"), { where: { id: this.props.id }, limit: 1 }, "block"),
      data: new BlockFields("states", this.props.id, "data")
    };
  }

  setName(e: any) {
    db.collection("states").updateOne(
      { id: this.props.id },
      {
        $set: { name: e.target.value }
      }
    );
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
