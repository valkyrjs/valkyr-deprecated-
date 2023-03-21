import { Controller, ControllerRoutes, Routed } from "@valkyr/solid";

import { ContainerSubscriber } from "~Services/Ledger/Subscriber/ContainerSubscriber";
import { router } from "~Services/Router";

export class TemplateController extends Controller<Routed> {
  readonly plugins = [ControllerRoutes.for(router, "workspace-template")];

  #workspaceSubscription?: () => void;
  #currentWorkspaceId?: string;

  async onInit(): Promise<void> {
    const workspaceId = router.params.get("workspaceId");
    if (this.#currentWorkspaceId !== workspaceId) {
      this.#workspaceSubscription?.();
      this.#currentWorkspaceId = workspaceId;
      if (workspaceId !== undefined) {
        console.log("Subscribing to workspace", workspaceId);
        this.#workspaceSubscription = await ContainerSubscriber.subscribe(workspaceId);
      }
    }
  }
}
