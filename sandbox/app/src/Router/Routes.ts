import { Route } from "@valkyr/router";

import { Events } from "../Pages/Events";
import { Home } from "../Pages/Home";
import { renderAuthorized } from "./Actions/RenderAuthorized";
import { router } from "./Router";

router.register([new Route("/", [renderAuthorized([Home], "Home")]), new Route("/events", [renderAuthorized([Events], "Events")])]);
