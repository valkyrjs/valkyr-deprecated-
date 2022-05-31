import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@valkyr/angular";
import { ModalService, SelectOptions } from "@valkyr/tailwind";
import { CurrentWorkspaceService } from "src/app/Shared/WorkspaceServices/CurrentWorkspaceService";
import { WorkspaceStore } from "stores";

import { MenuItem } from "../../../Shared/Layout/Models/MenuItem";
import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { WorkspaceService } from "../../../Shared/WorkspaceServices/WorkspaceService";
import { CreateWorkspaceDialog } from "../CreateWorkspace/Component";
import { getFooterMenu, getHeaderMenu, getMainMenu } from "../Menu";

@Component({
  selector: "workspace-list",
  templateUrl: "./Template.html"
})
export class WorkspaceListComponent implements OnInit, OnDestroy {
  workspaces: WorkspaceStore.Workspace[] = [];
  workspaceOptions: SelectOptions = [];
  name = "";

  constructor(
    readonly layout: LayoutService,
    readonly router: Router,
    readonly modal: ModalService<CreateWorkspaceDialog>,
    readonly workspace: WorkspaceService,
    readonly currentWorkspace: CurrentWorkspaceService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.#loadWorkspaces();
    this.layout.updateLayout({
      header: {
        isVisible: true,
        menu: getHeaderMenu()
      },
      sidebar: { isVisible: false },
      sidepane: {
        isVisible: true,
        isBordered: false,
        actions: this.getActions(),
        mainMenu: getMainMenu(),
        footerMenu: getFooterMenu()
      },
      nav: { isVisible: true, isBordered: false, title: "Workspaces" }
    });
  }

  ngOnDestroy(): void {
    this.workspace.unsubscribe();
  }

  async #loadWorkspaces() {
    const user = await this.auth.getUser();
    console.log(user);
    this.workspace.subscribe(
      {
        criteria: {
          "members.id": this.auth.user
        },
        stream: {
          aggregate: "workspace",
          streamIds: user.data["workspaces"] as string[]
        }
      },
      (workspaces) => {
        this.workspaces = workspaces;
        this.workspaceOptions = workspaces.map((w) => ({ label: w.name, value: w.id }));
      }
    );
  }

  activateWorkspace(id: string) {
    this.currentWorkspace.activateWorkspace(id);
    this.router.navigateByUrl(`/`);
  }

  openAddWorkspace() {
    this.modal.open(CreateWorkspaceDialog);
  }

  getActions(): MenuItem[] {
    return [{ name: "New workspace", isActive: false, type: "action", action: this.openAddWorkspace.bind(this) }];
  }
}
