import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { NodeFields } from "../node.fields";
import { getTypeCache } from "../node.utils";
import { TypeData } from "./type.node";

export class TypeNodeController extends Controller<
  {
    node: Node<TypeData>;
    data: NodeFields<TypeData>;
  },
  { id: string }
> {
  async onInit() {
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node"),
      data: new NodeFields<TypeData>(this.props.id, "data", (node: Node<TypeData>) => {
        return getTypeCache(node.data.name, node.data.data);
      })
    };
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
