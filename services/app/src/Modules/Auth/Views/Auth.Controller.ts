import { Controller, ControllerRoutes, Routed } from "@valkyr/solid";

import { router } from "~Services/Router";

export class AuthController extends Controller<Routed> {
  readonly plugins = [ControllerRoutes.for(router, "auth")];
}
