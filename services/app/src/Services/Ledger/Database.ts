import { Document, IndexedDatabase } from "@valkyr/db";

import { AppEventRecord } from "./EventRecord";

export const db = new IndexedDatabase<{
  cursors: Document<{ timestamp: string }>;
  events: Document<AppEventRecord>;
}>({
  name: "valkyr:events",
  version: 1,
  registrars: [
    {
      name: "events",
      indexes: [
        ["container", { unique: false }],
        ["stream", { unique: false }],
        ["created", { unique: false }],
        ["recorded", { unique: false }]
      ]
    },
    { name: "cursors" }
  ]
});
