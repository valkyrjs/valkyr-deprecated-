import { IndexedDatabase } from "@valkyr/db";

import { EventDocument } from "./Event.Collection";
import { EventGroupDocument } from "./EventGroup.Collection";

export const db = new IndexedDatabase<{
  groups: EventGroupDocument;
  events: EventDocument;
}>({
  name: "valkyr:events",
  version: 1,
  registrars: [
    {
      name: "groups",
      indexes: [["name", { unique: true }]]
    },
    {
      name: "events",
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
    events: typeof db;
  }
}

window.events = db;
