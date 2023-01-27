import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import type { TypeData } from "../../modules/editor/library/nodes/type/type.node";

const primitives: Type[] = [
  { id: 1, type: "primitive", name: "string" },
  { id: 2, type: "primitive", name: "number" },
  { id: 3, type: "primitive", name: "boolean" }
];

export class SelectController extends Controller<
  {
    types: Type[];
    selected: Type;
  },
  {
    selected?: string;
    onSelect: (value: string) => void;
  }
> {
  async onInit() {
    const types = await this.#queryTypes();
    return {
      types,
      selected: types.find((type) => getTypeValue(type) === this.props.selected) ?? types[0]
    };
  }

  async #queryTypes() {
    const nodes = await this.query(db.collection("nodes"), { where: { type: "type" } }, async (nodes) => ({
      types: this.#getTypes(nodes)
    }));
    return this.#getTypes(nodes);
  }

  #getTypes(nodes: Node<TypeData>[]): Type[] {
    return [
      ...primitives,
      ...nodes.map<Type>((node) => ({
        id: node.id,
        type: "custom",
        name: node.data.name
      }))
    ];
  }

  setSelected(type: Type) {
    this.setState("selected", type);
    this.props.onSelect(getTypeValue(type));
  }
}

function getTypeValue(type: Type) {
  if (type.type === "primitive") {
    return `p:${type.name}`;
  }
  return `t:${type.name}`;
}

type Type = {
  id: string | number;
  type: "primitive" | "custom";
  name: string;
};
