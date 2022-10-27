import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { db } from "~services/database";
import { router } from "~services/router";

import { User } from "./models/user.entity";
import { DatabaseTemplateView } from "./views/database-template.view";

/*
 |--------------------------------------------------------------------------------
 | Models
 |--------------------------------------------------------------------------------
 */

db.register([{ name: "users", model: User }]);

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

router.register([
  new Route({
    name: "Database",
    path: "/",
    actions: [render(DatabaseTemplateView)]
  })
]);
