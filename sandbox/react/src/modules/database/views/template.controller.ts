import { Controller, ControllerRoutes, ViewController } from "@valkyr/react";
import { RoutedResult } from "@valkyr/router";

import { router } from "~services/router";

class DatabaseTemplateController extends Controller<State> {
  #routes = new ControllerRoutes(this, router, [
    { path: "/" },
    { path: "/users" },
    { path: "/posts" },
    { path: "/router", query: ["foo", "x"] },
    { path: "/form" }
  ]);

  async onInit() {
    return {
      routed: await this.#routes.subscribe()
    };
  }
}

type State = {
  routed?: RoutedResult<typeof router>;
};

export const controller = new ViewController(DatabaseTemplateController);
