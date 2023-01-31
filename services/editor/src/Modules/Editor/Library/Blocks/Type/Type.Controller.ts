import { Controller } from "@valkyr/react";

import { db } from "~Services/Database";

import { BlockFields } from "../../Utilities/BlockFields";
import { TypeBlock } from "./Type.Collection";

export class TypeBlockController extends Controller<
  {
    block?: TypeBlock;
    data: BlockFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(db.collection("types"), { where: { id: this.props.id }, limit: 1 }, "block"),
      data: new BlockFields("types", this.props.id, "data")
    };
  }

  setName(e: any) {
    db.collection("types").updateOne(
      { id: this.props.id },
      {
        $set: { name: e.target.value }
      }
    );
  }

  async onRemove() {
    await db.collection("types").remove({ id: this.props.id });
  }
}
