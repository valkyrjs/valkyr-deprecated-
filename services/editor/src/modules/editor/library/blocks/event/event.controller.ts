import { Controller } from "@valkyr/react";

import { db } from "~services/database";

import { BlockFields } from "../../utilities/block-fields";
import { EventBlock } from "./event.collection";

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
      block: await this.query(db.collection("events"), { where: { id: this.props.id }, limit: 1 }, "block"),
      data: new BlockFields("events", this.props.id, "data"),
      meta: new BlockFields("events", this.props.id, "meta")
    };
  }

  setName(e: any) {
    db.collection("events").updateOne(
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
