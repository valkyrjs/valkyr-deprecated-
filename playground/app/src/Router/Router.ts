import { createBrowserHistory, Router } from "@valkyr/router";
import { Route } from "@valkyr/router";

import { Home } from "../Pages/Home";
import { renderAuthorized } from "./Actions/RenderAuthorized";

export const router = new Router(createBrowserHistory());

router.register([new Route("/", [renderAuthorized([Home], "Home")])]);
