import { Component, OnDestroy, OnInit } from "@angular/core";
import { LayoutService } from "src/app/Shared/Layout/Services/LayoutService";

import type { MenuCategory, MenuItem } from "../../../Shared/Layout";
import { CurrentWorkspaceService, Workspace } from "../../../Shared/WorkspaceServices";

@Component({
  selector: "workspace-item",
  templateUrl: "./Template.html"
})
export class WorkspaceItemComponent implements OnInit, OnDestroy {
  workspace!: Workspace;

  constructor(readonly currentWorkspace: CurrentWorkspaceService, readonly layoutService: LayoutService) {}

  ngOnInit(): void {
    this.currentWorkspace.workspace.subscribe((workspace) => {
      if (workspace) {
        this.workspace = workspace;
        this.layoutService.updateLayout({
          header: getHeaderMenu(this.workspace.name),
          sidebar: { isVisible: false },
          sidepane: {
            isVisible: true,
            actions: getActions(),
            mainMenu: getMainMenu(workspace.name),
            footerMenu: getFooterMenu()
          },
          nav: { isVisible: true, title: `${workspace.name} Dashboard` }
        });
      }
    });
  }

  ngOnDestroy(): void {}
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
    }
  ];
}

function getFooterMenu(): MenuCategory[] {
  return [];
}

function getActions(): MenuItem[] {
  return [];
}
