import { Controller } from "@valkyr/react";

import { EventBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { BlockFields } from "../BlockFields";

export class EventBlockController extends Controller<
  {
    block?: EventBlock;
    data: BlockFields;
    meta: BlockFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(db.collection<EventBlock>("blocks"), { where: { id: this.props.id }, limit: 1 }, "block"),
      data: new BlockFields("blocks", this.props.id, "data"),
      meta: new BlockFields("blocks", this.props.id, "meta")
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
