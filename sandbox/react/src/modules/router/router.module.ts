import { Route } from "@valkyr/router";

import { render } from "~middleware/render";

import { RouterView } from "./views/router.view";

export const routes = [
  new Route({
    name: "Router",
    path: "/router",
    actions: [render(RouterView)]
  })
];
