import { Controller } from "@valkyr/react";

import { ValidatorDocument } from "../Data/Validator.Collection";
import { db } from "../Data/Validator.Database";

export class ValidatorController extends Controller<
  {
    validator?: ValidatorDocument;
  },
  {
    id: string;
  }
> {
  #collection = db.collection("validators");

  async onInit() {
    return {
      validator: await this.query(this.#collection, { where: { id: this.props.id }, limit: 1 }, "validator")
    };
  }

  async onChange(value: string) {
    this.#collection.updateOne({ id: this.props.id }, { $set: { value } });
  }

  async onRemove() {
    const isConfirmed = confirm("Are you sure you want to delete this validator?");
    if (isConfirmed === true) {
      await this.#collection.remove({ id: this.props.id });
    }
  }
}
