import { Controller } from "@valkyr/react";

import { db } from "~Services/Database";

import { BlockFields } from "../BlockFields";
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

  setName(name: string) {
    db.collection("types").updateOne(
      { id: this.props.id },
      {
        $set: { name }
      }
    );
  }

  async onRemove() {
    await db.collection("types").remove({ id: this.props.id });
  }
}
