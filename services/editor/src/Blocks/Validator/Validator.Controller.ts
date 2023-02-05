import { Controller } from "@valkyr/react";

import { ValidatorBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export class ValidatorController extends Controller<
  {
    block?: ValidatorBlock;
  },
  {
    id: string;
  }
> {
  async onInit() {
    return {
      block: await this.query(
        db.collection<ValidatorBlock>("blocks"),
        { where: { id: this.props.id }, limit: 1 },
        "block"
      )
    };
  }

  onChange(value: string) {
    db.collection<ValidatorBlock>("blocks").updateOne({ id: this.props.id }, { $set: { value } });
  }

  async onRemove() {
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
