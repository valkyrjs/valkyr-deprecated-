import { Component, Injector, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataSubscriber, LedgerService, Menu } from "@valkyr/angular";

import { Workspace } from "./Models/Workspace";
import { WorkspaceSelectorService } from "./Services/WorkspaceSelectorService";

@Component({
  selector: "workspace",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class WorkspaceComponent extends DataSubscriber implements OnDestroy {
  aside!: Menu;
  footer!: Menu;

  workspace?: Workspace;

  constructor(
    route: ActivatedRoute,
    readonly selector: WorkspaceSelectorService,
    readonly ledger: LedgerService,
    injector: Injector
  ) {
    super(injector);
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
    this.subscription?.unsubscribe();
  }

  #loadMenu(workspaceId: string) {
    this.aside = new Menu({
      categories: [
        {
          name: "Workspace",
          items: [
            {
              name: "Dashboard",
              href: "/workspaces/{{workspaceId}}"
            },
            {
              name: "Todos",
              href: "/workspaces/{{workspaceId}}/todos"
            }
          ]
        }
      ],
      params: {
        workspaceId
      }
    });
    this.footer = new Menu({
      categories: [
        {
          name: "Discovery",
          items: [
            {
              name: "Workspaces",
              href: "/workspaces"
            }
          ]
        }
      ],
      params: {
        workspaceId
      }
    });
  }

  #loadSelector(workspaceId: string) {
    this.selector.current = workspaceId;
  }

  #loadWorkspace(id: string) {
    this.subscribe(
      Workspace,
      {
        criteria: { id },
        limit: 1,
        stream: {
          aggregate: "workspace",
          streamIds: [id]
        }
      },
      (workspace) => {
        this.workspace = workspace;
      }
    );
  }
}
