import { Controller, ControllerRoutes } from "@valkyr/react";
import { RoutedResult } from "@valkyr/router";

import { router } from "~Services/Router";

export class ApplicationController extends Controller<{
  routed?: RoutedResult<typeof router>;
}> {
  async onInit() {
    return {
      routed: await new ControllerRoutes(this, router, "application").subscribe("routed")
    };
  }
}
