import { Component, OnDestroy, OnInit } from "@angular/core";
import { MenuCategory, MenuItem } from "src/app/Shared/Layout";
import { WorkspaceStore } from "stores";

import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { CurrentWorkspaceService, Workspace, WorkspaceService } from "../../../Shared/WorkspaceServices";

@Component({
  selector: "workspace-invites",
  templateUrl: "./Template.html",
  styleUrls: ["./Styles.scss"]
})
export class WorkspaceInvitesComponent implements OnInit, OnDestroy {
  alias = "";
  invites: WorkspaceStore.Invite[] = [];

  constructor(
    readonly currentWorkspaceService: CurrentWorkspaceService,
    readonly workspaceService: WorkspaceService,
    readonly layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.currentWorkspaceService.workspace.subscribe((workspace) => {
      if (workspace) {
        this.invites = workspace?.invites.getAll();
        this.#loadLayout(workspace);
      }
    });
  }

  ngOnDestroy(): void {
    this.currentWorkspaceService.unsubscribe();
  }

  invite() {
    this.workspaceService.invite(this.alias);
  }

  #loadLayout(workspace: Workspace) {
    this.layoutService.updateLayout({
      header: getHeaderMenu(workspace.name),
      sidepane: {
        mainMenu: getMainMenu(workspace.name),
        footerMenu: [],
        actions: []
      },
      nav: {
        title: `${workspace.name} Invites`
      }
    });
  }
}

function getHeaderMenu(workspaceName: string): { isVisible: boolean; menu: MenuItem[] } {
  return {
    isVisible: true,
    menu: [
      {
        type: "link",
        icon: "home",
        name: "Home",
        isActive: false,
        href: "/workspaces"
      },
      {
        type: "link",
        icon: "template",
        name: workspaceName,
        isActive: true,
        href: "/"
      }
    ]
  };
}

function getMainMenu(workspaceName: string): MenuCategory[] {
  return [
    {
      name: workspaceName,
      items: [
        {
          type: "link",
          name: "Dashboard",
          icon: "template",
          isActive: true,
          href: `/`
        },
        {
          type: "link",
          name: "Board",
          icon: "tasks",
          isActive: false,
          href: `/boards`
        },
        {
          type: "link",
          name: "Invites",
          icon: "mail",
          isActive: false,
          href: `/invites`
        }
      ]
    },
    {
      name: "Filters",
      items: [
        {
          type: "link",
          name: "Accepted Invites",
          icon: "users",
          isActive: false,
          href: `/invites?status=completed`
        },
        {
          type: "link",
          name: "Pending Invites",
          icon: "mail",
          isActive: false,
          href: `/invites`
        }
      ]
    }
  ];
}
