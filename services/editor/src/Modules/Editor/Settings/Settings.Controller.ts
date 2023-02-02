import { Controller } from "@valkyr/react";

import { TypeBlock } from "~Blocks/Type/Type.Collection";
import { db } from "~Services/Database";

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
