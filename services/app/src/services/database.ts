import { IndexedDatabase } from "@valkyr/db";

import type { Post } from "../modules/database/models/post.entity";
import type { User } from "../modules/database/models/user.entity";

export const db = new IndexedDatabase<{
  posts: Post;
  users: User;
}>({
  name: "valkyr",
  version: 1,
  registrars: [
    { name: "users" },
    {
      name: "posts",
      indexes: [["createdBy", { unique: false }]]
    }
  ],
  log: console.log
});
