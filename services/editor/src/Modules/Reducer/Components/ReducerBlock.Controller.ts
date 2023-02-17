import { Controller } from "@valkyr/react";

import { ReducerDocument } from "../Data/Reducer.Collection";
import { db } from "../Data/Reducer.Database";

export class ReducerBlockController extends Controller<
  {
    reducer?: ReducerDocument;
  },
  {
    id: string;
  }
> {
  async onInit() {
    return {
      reducer: await this.query(db.collection("reducers"), { where: { id: this.props.id }, limit: 1 }, "reducer")
    };
  }

  onChange(value: string) {
    db.collection("reducers").updateOne({ id: this.props.id }, { $set: { value } });
  }

  async onRemove() {
    const isConfirmed = confirm("Are you sure you want to delete this reducer?");
    if (isConfirmed === true) {
      await db.collection("reducers").remove({ id: this.props.id });
    }
  }
}
