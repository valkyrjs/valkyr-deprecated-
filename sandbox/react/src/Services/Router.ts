import { createBrowserHistory, Router } from "@valkyr/router";
import { FunctionComponent } from "react";

export const router = new Router<FunctionComponent>(createBrowserHistory());
