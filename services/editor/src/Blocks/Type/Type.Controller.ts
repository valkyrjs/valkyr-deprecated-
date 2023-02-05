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
      block: await this.query(db.collection<TypeBlock>("blocks"), { where: { id: this.props.id }, limit: 1 }, "block")
    };
  }

  onChange(value: string) {
    db.collection<TypeBlock>("blocks").updateOne({ id: this.props.id }, { $set: { value } });
  }

  async onRemove() {
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
