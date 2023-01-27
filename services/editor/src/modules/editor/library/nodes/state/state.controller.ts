import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { NodeFields } from "../node.fields";
import { StateData } from "./state.node";

export class StateNodeController extends Controller<
  {
    node: Node<StateData>;
    data: NodeFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node"),
      data: new NodeFields(this.props.id, "data")
    };
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
