import { IndexedDatabase } from "@valkyr/db";

import { ReducerDocument } from "./Reducer.Collection";
import { ReducerGroupDocument } from "./ReducerGroup.Collection";
import { StateDocument } from "./State.Collection";

export const db = new IndexedDatabase<{
  groups: ReducerGroupDocument;
  reducers: ReducerDocument;
  states: StateDocument;
}>({
  name: "valkyr:reducers",
  version: 1,
  registrars: [
    {
      name: "groups",
      indexes: [["name", { unique: true }]]
    },
    {
      name: "reducers",
      indexes: [["name", { unique: true }]]
    },
    {
      name: "states",
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
    reducers: typeof db;
  }
}

window.reducers = db;
