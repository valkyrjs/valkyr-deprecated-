import { Controller } from "@valkyr/react";

import { DataFields } from "~Library/DataField";

import { TypeDocument } from "../Data/Type.Collection";
import { db } from "../Data/Type.Database";

export class TypeBlockController extends Controller<
  {
    type?: TypeDocument;
    data: DataFields;
  },
  { id: string }
> {
  #collection = db.collection("types");

  async onInit() {
    return {
      type: await this.query(this.#collection, { where: { id: this.props.id }, limit: 1 }, "type")
    };
  }

  async onChange(value: string) {
    await this.#collection.updateOne({ id: this.props.id }, { $set: { value } });
  }

  async onRemove() {
    const isConfirmed = confirm("Are you sure you want to delete this type?");
    if (isConfirmed === true) {
      await this.#collection.remove({ id: this.props.id });
    }
  }
}
