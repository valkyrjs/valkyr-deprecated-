import { Controller } from "@valkyr/react";

import { getTypes } from "~Blocks/Model.Manager";

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
    const types = await this.#getTypes();
    return {
      types,
      selected: types.find((type) => getTypeValue(type) === this.props.selected) ?? types[0]
    };
  }

  #getTypes(): Type[] {
    return [
      ...primitives,
      ...getTypes().map<Type>((name) => ({
        id: name,
        type: "custom",
        name
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
