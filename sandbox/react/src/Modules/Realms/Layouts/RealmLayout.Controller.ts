import { router } from "@App/Services/Router";
import { Controller, ControllerRoutes, ViewController } from "@valkyr/react";
import { RoutedResult } from "@valkyr/router";

/*
 |--------------------------------------------------------------------------------
 | Controller
 |--------------------------------------------------------------------------------
 */

export class RealmLayoutController extends Controller<State> {
  #routes = new ControllerRoutes(this, router, [
    { path: "/realms/:realm" },
    { path: "/realms/:realm/members" },
    { path: "/realms/:realm/pages" },
    { path: "/realms/:realm/invites" }
  ]);

  async onResolve(): Promise<State> {
    return {
      routed: await this.#routes.subscribe()
    };
  }

  goTo(path: "" | "members" | "pages" | "invites"): () => void {
    return () => {
      router.goTo(`/realms/${router.params.get("realm")}/${path}`);
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type State = {
  routed?: RoutedResult<typeof router>;
};

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ViewController(RealmLayoutController);
