import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { db } from "~services/database";
import { router } from "~services/router";

import { User } from "./models/user.entity";
import { DashboardView } from "./views/dashboard.view";
import { RouterView } from "./views/router.view";
import { SampleFormView } from "./views/sample-form.view";
import { DatabaseTemplateView } from "./views/template.view";

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
    path: "/",
    actions: [render(DatabaseTemplateView)],
    children: [
      new Route({
        name: "Dashboard",
        path: "/",
        actions: [render(DashboardView)]
      }),
      new Route({
        name: "Database Users",
        path: "/database/users",
        actions: []
      }),
      new Route({
        name: "Router",
        path: "/router",
        actions: [render(RouterView)]
      }),
      new Route({
        name: "Form",
        path: "/form",
        actions: [render(SampleFormView)]
      })
    ]
  })
]);
