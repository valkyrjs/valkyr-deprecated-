import { IndexedDatabase } from "@valkyr/db";

import { TypeDocument } from "./Type.Collection";
import { TypeGroupComponent } from "./TypeGroup.Collection";

export const db = new IndexedDatabase<{
  groups: TypeGroupComponent;
  types: TypeDocument;
}>({
  name: "valkyr:types",
  version: 1,
  registrars: [
    {
      name: "groups",
      indexes: [["name", { unique: true }]]
    },
    {
      name: "types",
      indexes: [["name", { unique: true }]]
    }
  ]
});

/*
 |--------------------------------------------------------------------------------
 | Console Tools
 |--------------------------------------------------------------------------------
 */

declare global {
  interface Window {
    types: typeof db;
  }
}

window.types = db;
