import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { SelectOptions } from "@valkyr/tailwind/src/Select/Component";
import { MenuItem } from "src/app/Shared/Layout/Models/MenuItem";
import { Workspace } from "stores/src/Workspace";

import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { WorkspaceService } from "../../../Shared/WorkspaceServices/WorkspaceService";
import { CreateWorkspaceDialog } from "../Dialogues/CreateWorkspace/Component";
import { getFooterMenu, getHeaderMenu, getMainMenu } from "../Menu";

@Component({
  selector: "workspace-list",
  templateUrl: "./Template.html"
})
export class WorkspaceListComponent implements OnInit, OnDestroy {
  workspaces: Workspace[] = [];
  workspaceOptions: SelectOptions = [];
  name = "";

  constructor(
    readonly layout: LayoutService,
    readonly modal: ModalService<CreateWorkspaceDialog>,
    readonly workspace: WorkspaceService,
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
    this.workspace.unsubscribe(this);
  }

  #loadWorkspaces() {
    this.workspace.subscribe(
      this,
      {
        criteria: {
          "members.id": this.auth.auditor
        }
      },
      (workspaces) => {
        this.workspaces = workspaces;
        this.workspaceOptions = workspaces.map((w) => ({ label: w.name, value: w.id }));
      }
    );
  }

  openAddWorkspace() {
    this.modal.open(CreateWorkspaceDialog);
  }

  getActions(): MenuItem[] {
    return [{ name: "New workspace", type: "action", action: this.openAddWorkspace.bind(this) }];
  }
}
