import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { NodeFields } from "../node.fields";
import { getEventCache } from "../node.utils";
import { EventData } from "./event.node";

export class EventNodeController extends Controller<
  {
    node: Node<EventData>;
    data: NodeFields<EventData>;
    meta: NodeFields<EventData>;
  },
  { id: string }
> {
  async onInit() {
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node"),
      data: new NodeFields(this.props.id, "data", getCache),
      meta: new NodeFields(this.props.id, "meta", getCache)
    };
  }
}

function getCache(node: Node<EventData>): string {
  return getEventCache(node.data);
}
