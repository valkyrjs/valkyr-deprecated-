import { Route } from "@valkyr/router";

import { render } from "~middleware/render";
import { router } from "~services/router";

import { DashboardView } from "./dashboard";

router.register([
  new Route({
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    actions: [render(DashboardView)]
  })
]);
