import { Controller } from "@valkyr/react";

import { db } from "~services/database";

import { Type } from "../library/nodes/type/type.node";

export class SettingsController extends Controller<
  {
    types: Type[];
  },
  {
    isOpen: boolean;
    setClosed: () => void;
  }
> {
  async onInit() {
    return {
      isOpen: false,
      types: await this.query(db.collection("types"), {}, async (documents) => {
        return {
          types: documents
        };
      })
    };
  }

  #addType(add: () => void): () => void {
    return () => {
      add();
    };
  }
}
