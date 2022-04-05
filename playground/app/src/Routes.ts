import { Route, router } from "@valkyr/react";

import { Workspace } from "~Pages/Workspace";

import { renderAuthorized } from "./Middleware/RenderAuthorized";
import { AccountPage } from "./Pages/Account";
import { Home } from "./Pages/Home";

router.register([
  new Route("/", [renderAuthorized([Home], "Home")]),
  new Route("/account", [renderAuthorized([AccountPage], "Account")]),
  new Route("/workspaces/:workspace", [renderAuthorized([Workspace], "Workspace")])
]);
