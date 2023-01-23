import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { EventConfig } from "../types";

export class EventNodeController extends Controller<EventConfig, Node<EventConfig>> {
  #typeTimeout: any;

  async onResolve() {
    return {
      type: this.props.data.type ?? "",
      data: this.props.data.data ?? {},
      meta: this.props.data.meta ?? {}
    };
  }

  setType(e: any) {
    clearTimeout(this.#typeTimeout);
    this.#typeTimeout = setTimeout(() => {
      db.collection("nodes").updateOne({ id: this.props.id }, { $set: { "data.type": e.target.value } });
    }, 500);
  }
}
