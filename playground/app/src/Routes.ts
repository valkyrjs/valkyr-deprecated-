import { Route } from "@valkyr/router";

import { AccountPage } from "./Pages/Account";
import { Home } from "./Pages/Home";
import { renderAuthorized, router } from "./Router";

router.register([
  new Route("/", [renderAuthorized([Home], "Home")]),
  new Route("/account", [renderAuthorized([AccountPage], "Account")])
]);
