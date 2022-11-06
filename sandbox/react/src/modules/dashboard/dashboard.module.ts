import { Route } from "@valkyr/router";

import { render } from "~middleware/render";

import { DashboardView } from "./views/dashboard.view";

export const routes = [
  new Route({
    name: "Dashboard",
    path: "/dashboard",
    actions: [render(DashboardView)]
  })
];
