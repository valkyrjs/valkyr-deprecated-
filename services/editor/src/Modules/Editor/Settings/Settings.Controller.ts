import { Controller } from "@valkyr/react";

import { db } from "~Services/Database";

import { TypeBlock } from "../Library/Blocks/Type/Type.Collection";

export class SettingsController extends Controller<
  {
    types: TypeBlock[];
  },
  {
    isOpen: boolean;
    setClosed: () => void;
  }
> {
  async onInit() {
    return {
      isOpen: false,
      types: await this.query(db.collection("types"), {}, "types")
    };
  }
}
