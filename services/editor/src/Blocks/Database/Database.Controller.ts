import { Controller } from "@valkyr/react";

import { DatabaseBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export class DatabaseController extends Controller<
  {
    block?: DatabaseBlock;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(
        db.collection<DatabaseBlock>("blocks"),
        { where: { id: this.props.id }, limit: 1 },
        "block"
      )
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
