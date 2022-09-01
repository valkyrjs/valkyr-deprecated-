import { router } from "@App/Services/Router";
import { Controller, ReactViewController } from "@valkyr/mvc";
import { Subject } from "rxjs";

const routed = new Subject<string>();

/*
 |--------------------------------------------------------------------------------
 | Controller
 |--------------------------------------------------------------------------------
 */

export class RealmLayoutController extends Controller<State> {
  async resolve(): Promise<void> {
    this.#subscribeToRoutes();
    this.setState("component", router.route.name);
  }

  #subscribeToRoutes() {
    this.subscribe("component", routed);
  }

  goTo(path: "" | "members" | "pages" | "invites"): () => void {
    return () => {
      router.goTo(`/realms/${router.params.get("realm")}/${path}`, { render: false });
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------------
 */

router.subscribe(
  ["/realms/:realms", "/realms/:realm/members", "/realms/:realm/pages", "/realms/:realm/invites"],
  ({ route }) => {
    routed.next(route.name);
  }
);

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type State = {
  component?: string;
};

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ReactViewController(RealmLayoutController);
