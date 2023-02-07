import { Controller } from "@valkyr/react";

import { EventBlock } from "~Blocks/Block.Collection";
import { addNode } from "~ReactFlow/Data/Node.Collection";
import { db } from "~Services/Database";

import { BlockFields } from "../Block.Fields";

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

  onCopy() {
    addNode("event", this.props.id);
  }

  onRemove() {
    db.collection("nodes").remove({ "data.blockId": this.props.id });
  }
}
