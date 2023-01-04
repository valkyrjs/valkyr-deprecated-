import { Controller, ControllerRoutes } from "@valkyr/react";
import { RoutedResult } from "@valkyr/router";

import { router } from "~services/router";

export class LayoutController extends Controller<{
  routed?: RoutedResult<typeof router>;
}> {
  async onInit() {
    return {
      routed: await new ControllerRoutes(this, router, "app").subscribe("routed")
    };
  }
}
