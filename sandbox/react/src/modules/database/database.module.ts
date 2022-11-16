import { db } from "~services/database";

import { Post } from "./models/post.entity";
import { User } from "./models/user.entity";

export { PerformanceView } from "./views/performance.view";
export { PostsView } from "./views/posts.view";
export { TestsView } from "./views/tests.view";
export { UsersView } from "./views/users.view";

db.register([
  { name: "users", model: User },
  {
    name: "posts",
    model: Post,
    indexes: [["createdBy", { unique: false }]]
  }
]);
