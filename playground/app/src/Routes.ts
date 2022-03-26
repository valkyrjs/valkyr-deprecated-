import { Route, router } from "@valkyr/react";

import { renderAuthorized } from "./Middleware/RenderAuthorized";
import { AccountPage } from "./Pages/Account";
import { Home } from "./Pages/Home";

router.register([
  new Route("/", [renderAuthorized([Home], "Home")]),
  new Route("/account", [renderAuthorized([AccountPage], "Account")])
]);
