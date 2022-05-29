import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ParamsService } from "@valkyr/angular";
import { WorkspaceStore } from "stores";

import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { Workspace, WorkspaceService } from "../../../Shared/WorkspaceServices";
import { getWorkspaceFooterMenu, getWorkspaceHeaderMenu, getWorkspaceMainMenu } from "../Menu";

@Component({
  selector: "workspace-invites",
  templateUrl: "./Template.html",
  styleUrls: ["./Styles.scss"]
})
export class WorkspaceInvitesComponent implements OnInit, OnDestroy {
  alias = "";
  invites: WorkspaceStore.Invite[] = [];

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
        this.service.selected = id;
        this.params.next(params);
      }
    });
  }

  ngOnDestroy(): void {
    this.service.unsubscribe();
  }

  invite() {
    this.service.invite(this.alias);
  }

  #loadWorkspace(id: string) {
    this.service.subscribe(
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
          this.invites = workspace.invites.getAll();
          this.#loadLayout(workspace);
        }
      }
    );
  }

  #loadLayout(workspace: Workspace) {
    this.layoutService.updateLayout({
      header: {
        menu: getWorkspaceHeaderMenu(workspace.name, workspace.id)
      },
      sidepane: {
        mainMenu: getWorkspaceMainMenu(workspace.name, workspace.id),
        footerMenu: getWorkspaceFooterMenu(workspace.id)
      },
      nav: {
        title: `${workspace.name} Invites`
      }
    });
  }
}
