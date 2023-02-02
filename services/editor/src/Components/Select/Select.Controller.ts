import { Controller } from "@valkyr/react";

import { db } from "../../Services/Database";
import { TypeBlock } from "../Blocks/Type/Type.Collection";

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
    const types = await this.query(db.collection("types"), {}, async (types) => ({
      types: this.#getTypes(types)
    }));
    return this.#getTypes(types);
  }

  #getTypes(blocks: TypeBlock[]): Type[] {
    return [
      ...primitives,
      ...blocks.map<Type>((block) => ({
        id: block.id,
        type: "custom",
        name: block.name
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
