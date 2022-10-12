import { render } from "@App/Middleware/Render";
import { router } from "@App/Services/Router";
import { Route } from "@valkyr/router";

import { Signup } from "./Views/Signup";

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

router.register([
  new Route({
    name: "Signup",
    path: "/signup",
    actions: [render([Signup])]
  })
]);
