import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { IdentityService } from "@valkyr/identity";
import { SelectOptions } from "@valkyr/tailwind/src/Select/Component";
import { MenuItem } from "src/app/Library/Layout/Models/MenuItem";
import { Workspace } from "stores/src/Workspace";

import { LayoutService } from "../../../Library/Layout/Services/LayoutService";
import { WorkspaceService } from "../../../Library/WorkspaceServices/WorkspaceService";
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
    readonly identity: IdentityService
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
        actions: this.getActions(),
        mainMenu: getMainMenu(),
        footerMenu: getFooterMenu()
      },
      nav: { isVisible: true, title: "Workspaces" }
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
          "members.id": this.identity.auditor
        },
        stream: {
          aggregate: "workspace",
          endpoint: "/workspaces"
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
