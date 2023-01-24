import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { Event } from "../../types";

export class NodeController extends Controller<never, Node<Event>> {
  #dataTimeout: any;

  setData(e: any) {
    clearTimeout(this.#dataTimeout);
    if (e.target.id === "data.new") {
      const newField = e.target.value;
      this.#dataTimeout = setTimeout(() => {
        db.collection("nodes").updateOne(
          { id: this.props.id },
          {
            $set: { [`data.data.${newField}`]: "string" }
          }
        );
      }, 500);
    } else if (e.target.id === `data.${e.target.value}`) {
      // field is unchanged.
    } else {
      const oldField = e.target.id;
      const newField = e.target.value;
      this.#dataTimeout = setTimeout(() => {
        db.collection("nodes").updateOne(
          { id: this.props.id },
          {
            $unset: { [`${oldField}`]: 1 },
            $set: { [`data.data.${newField}`]: "string" }
          }
        );
      }, 500);
    }
  }
}
