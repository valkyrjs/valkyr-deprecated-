import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LedgerService, LedgerSubscription } from "@valkyr/angular";
import { Menu } from "@valkyr/tailwind";

import { getFooterMenu, getMainMenu } from "./Menu";
import { WorkspaceService } from "./Services/Workspace";

@Component({
  selector: "workspace",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class WorkspaceComponent implements OnDestroy {
  aside!: Menu;
  footer!: Menu;

  #subscription?: LedgerSubscription;

  constructor(readonly workspace: WorkspaceService, readonly ledger: LedgerService, route: ActivatedRoute) {
    const workspaceId = route.snapshot.paramMap.get("workspace");
    if (!workspaceId) {
      throw new Error("WorkspaceComponent Violation: Could not resolve workspace id");
    }
    this.#loadMenu(workspaceId);
    this.#loadSelector(workspaceId);
    this.#loadWorkspace(workspaceId);
  }

  ngOnDestroy(): void {
    this.workspace.selected = undefined;
    this.#subscription?.unsubscribe();
  }

  #loadMenu(workspaceId: string) {
    this.aside = getMainMenu(workspaceId);
    this.footer = getFooterMenu(workspaceId);
  }

  #loadSelector(workspaceId: string) {
    this.workspace.selected = workspaceId;
  }

  #loadWorkspace(workspaceId: string) {
    this.#subscription = this.ledger.subscribe(workspaceId);
  }
}
