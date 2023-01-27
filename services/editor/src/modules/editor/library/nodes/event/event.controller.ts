import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { NodeFields } from "../node.fields";
import { EventData } from "./event.node";

export class EventNodeController extends Controller<
  {
    node: Node<EventData>;
    data: NodeFields;
    meta: NodeFields;
  },
  { id: string }
> {
  async onInit() {
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node"),
      data: new NodeFields(this.props.id, "data"),
      meta: new NodeFields(this.props.id, "meta")
    };
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
