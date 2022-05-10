import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LedgerService, LedgerSubscription, Menu } from "@valkyr/angular";

import { getFooterMenu, getMainMenu } from "./Menu";
import { WorkspaceSelectorService } from "./Services/WorkspaceSelectorService";

@Component({
  selector: "workspace",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class WorkspaceComponent implements OnDestroy {
  aside!: Menu;
  footer!: Menu;

  #subscription?: LedgerSubscription;

  constructor(readonly selector: WorkspaceSelectorService, readonly ledger: LedgerService, route: ActivatedRoute) {
    const workspaceId = route.snapshot.paramMap.get("workspace");
    if (!workspaceId) {
      throw new Error("WorkspaceComponent Violation: Could not resolve workspace id");
    }
    this.#loadMenu(workspaceId);
    this.#loadSelector(workspaceId);
    this.#loadWorkspace(workspaceId);
  }

  ngOnDestroy(): void {
    this.selector.current = undefined;
    this.#subscription?.unsubscribe();
  }

  #loadMenu(workspaceId: string) {
    this.aside = getMainMenu(workspaceId);
    this.footer = getFooterMenu(workspaceId);
  }

  #loadSelector(workspaceId: string) {
    this.selector.current = workspaceId;
  }

  #loadWorkspace(workspaceId: string) {
    this.#subscription = this.ledger.subscribe("workspace", workspaceId, true);
  }
}
