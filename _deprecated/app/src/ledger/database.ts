import { IndexedDatabase } from "@valkyr/db";
import { EventRecord } from "@valkyr/ledger";

import { Cursor } from "./models/cursor.entity";

export const db = new IndexedDatabase<{
  cursors: Cursor;
  events: EventRecord;
}>({
  name: "ledger:events",
  version: 1,
  registrars: [
    {
      name: "events",
      indexes: [
        ["stream", { unique: false }],
        ["created", { unique: false }],
        ["recorded", { unique: false }]
      ]
    },
    {
      name: "cursors"
    }
  ],
  log: console.log
});
