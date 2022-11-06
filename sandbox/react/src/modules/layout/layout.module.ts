import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { router } from "~services/router";

import { routes as dashboardRoutes } from "../dashboard";
import { routes as databaseRoutes } from "../database";
import { routes as formRoutes } from "../form";
import { routes as routerRoutes } from "../router";
import { LayoutView } from "./views/layout.view";

router.register([
  new Route({
    id: "app",
    path: "/",
    base: "/dashboard",
    actions: [render(LayoutView)],
    children: [...dashboardRoutes, ...databaseRoutes, ...routerRoutes, ...formRoutes]
  })
]);
