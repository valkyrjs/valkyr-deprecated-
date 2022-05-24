import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ParamsService } from "@valkyr/angular";
import { MenuItem } from "src/app/Library/Layout";
import { LayoutService } from "src/app/Library/Layout/Services/LayoutService";

import { Workspace, WorkspaceService } from "../../../Library/WorkspaceServices";
import { getWorkspaceFooterMenu, getWorkspaceHeaderMenu, getWorkspaceMainMenu } from "../Menu";

@Component({
  selector: "workspace-item",
  templateUrl: "./Template.html"
})
export class WorkspaceItemComponent implements OnInit, OnDestroy {
  workspace?: Workspace;

  constructor(
    readonly service: WorkspaceService,
    readonly layoutService: LayoutService,
    readonly route: ActivatedRoute,
    readonly params: ParamsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get("workspace")!;
        this.#loadWorkspace(id);
        this.params.next(params);
      }
    });
  }

  ngOnDestroy(): void {
    this.service.unsubscribe(this);
  }

  getActions(): MenuItem[] {
    return [{ name: "New template", type: "action", action: () => window.alert("todo") }];
  }

  #loadWorkspace(id: string) {
    this.service.subscribe(
      this,
      {
        criteria: { id },
        limit: 1,
        stream: {
          aggregate: "workspace",
          streamIds: [id]
        }
      },
      (workspace) => {
        if (workspace) {
          this.workspace = workspace;
          // hack
          this.service.selected = workspace.id;
          this.layoutService.updateLayout({
            header: {
              isVisible: true,
              menu: getWorkspaceHeaderMenu(workspace.name, workspace.id)
            },
            sidebar: { isVisible: false },
            sidepane: {
              isVisible: true,
              actions: this.getActions(),
              mainMenu: getWorkspaceMainMenu(workspace.name, workspace.id),
              footerMenu: getWorkspaceFooterMenu(workspace.id)
            },
            nav: { isVisible: true, title: `${workspace.name} Dashboard` }
          });
        }
      }
    );
  }
}
