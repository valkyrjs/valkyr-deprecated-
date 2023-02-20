import { Controller } from "@valkyr/react";

import { DataFields } from "~Library/DataField";

import { db } from "../Data/Reducer.Database";
import { StateDocument } from "../Data/State.Collection";

export class StateNodeController extends Controller<
  {
    state?: StateDocument;
    data: DataFields;
  },
  { id: string }
> {
  #collection = db.collection("states");

  async onInit() {
    return {
      state: await this.query(this.#collection, { where: { id: this.props.id }, limit: 1 }, "state"),
      data: new DataFields(this.#collection, this.props.id, "data")
    };
  }

  async setName(name: string) {
    this.#collection.updateOne(
      { id: this.props.id },
      {
        $set: { name }
      }
    );
  }

  async onRemove() {
    const isConfirmed = confirm("Are you sure you want to delete this state?");
    if (isConfirmed === true) {
      await this.#collection.remove({ id: this.props.id });
    }
  }
}
