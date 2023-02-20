import { IndexedDatabase } from "@valkyr/db";

import { ValidatorDocument } from "./Validator.Collection";

export const db = new IndexedDatabase<{
  validators: ValidatorDocument;
}>({
  name: "valkyr:validators",
  version: 1,
  registrars: [
    {
      name: "validators",
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
    validators: typeof db;
  }
}

window.validators = db;
