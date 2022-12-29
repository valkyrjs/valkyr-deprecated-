import { IndexedDatabase } from "@valkyr/db";

import type { Post } from "../modules/database/models/post.entity";
import type { User } from "../modules/database/models/user.entity";
import type { Cursor, EventRecord } from "./ledger";

export const db = new IndexedDatabase<{
  cursors: Cursor;
  events: EventRecord;
  posts: Post;
  users: User;
}>("valkyr", 1, console.log).register([
  { name: "users" },
  {
    name: "posts",
    indexes: [["createdBy", { unique: false }]]
  },
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
]);
