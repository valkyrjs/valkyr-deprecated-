import { createBrowserHistory, Router } from "@valkyr/router";

export const router = new Router(createBrowserHistory());

import { Route } from "@valkyr/router";

import { Home } from "../pages/home";
import { renderAuthorized } from "./Actions/RenderAuthorized";

router.register([new Route("/", [renderAuthorized([Home], "Home")])]);
