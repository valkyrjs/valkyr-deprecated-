import { Controller } from "@valkyr/react";

import { db } from "~services/database";

import { TypeBlock } from "../library/blocks/type/type.collection";

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
