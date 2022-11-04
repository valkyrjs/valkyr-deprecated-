import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { db } from "~services/database";

import { Post } from "./models/post.entity";
import { User } from "./models/user.entity";
import { PostsView } from "./views/posts.view";
import { TestsView } from "./views/tests.view";
import { UsersView } from "./views/users.view";

/*
 |--------------------------------------------------------------------------------
 | Models
 |--------------------------------------------------------------------------------
 */

db.register([
  { name: "users", model: User },
  {
    name: "posts",
    model: Post,
    indexes: [["createdBy", { unique: false }]]
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

export const routes = [
  new Route({
    name: "Database Users",
    path: "/users",
    actions: [render(UsersView)]
  }),
  new Route({
    name: "Database Posts",
    path: "/posts",
    actions: [render(PostsView)]
  }),
  new Route({
    name: "Database Tests",
    path: "/tests",
    actions: [render(TestsView)]
  })
];
