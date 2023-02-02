import { Controller } from "@valkyr/react";

import { TypeBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { BlockFields } from "../BlockFields";

export class TypeBlockController extends Controller<
  {
    block?: TypeBlock;
    data: BlockFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(db.collection<TypeBlock>("blocks"), { where: { id: this.props.id }, limit: 1 }, "block"),
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
    await db.collection("blocks").remove({ id: this.props.id });
  }
}
