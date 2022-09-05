import { router } from "@App/Services/Router";
import { Controller, ViewController } from "@valkyr/react";
import { RoutedResult } from "@valkyr/router";

const routes = ["/realms/:realms", "/realms/:realm/members", "/realms/:realm/pages", "/realms/:realm/invites"];

/*
 |--------------------------------------------------------------------------------
 | Controller
 |--------------------------------------------------------------------------------
 */

export class RealmLayoutController extends Controller<State> {
  init() {
    this.routes(router, routes, "routed");
  }

  async resolve(): Promise<void> {}

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
  routed: RoutedResult<typeof router>;
};

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ViewController(RealmLayoutController);
