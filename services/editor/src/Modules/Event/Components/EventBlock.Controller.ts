import { Controller } from "@valkyr/react";

import { DataFields } from "~Library/DataField";

import { EventDocument } from "../Data/Event.Collection";
import { db } from "../Data/Event.Database";

export class EventBlockController extends Controller<
  {
    block?: EventDocument;
    data: DataFields;
    meta: DataFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      block: await this.query(db.collection("events"), { where: { id: this.props.id }, limit: 1 }, "block"),
      data: new DataFields(db.collection("events"), this.props.id, "data"),
      meta: new DataFields(db.collection("events"), this.props.id, "meta")
    };
  }

  async setName(name: string) {
    await db.collection("events").updateOne(
      { id: this.props.id },
      {
        $set: { name }
      }
    );
  }

  async onRemove() {
    const isConfirmed = confirm("Are you sure you want to delete this event?");
    if (isConfirmed === true) {
      await db.collection("events").remove({ id: this.props.id });
    }
  }
}
