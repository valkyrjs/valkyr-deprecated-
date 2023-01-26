import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { TypeNodeData } from "./type.node";

export class TypeNodeController extends Controller<
  {
    node: Node<TypeNodeData>;
  },
  { id: string }
> {
  async onInit() {
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node")
    };
  }
}
