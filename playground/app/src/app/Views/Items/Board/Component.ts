import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalService } from "@valkyr/tailwind";

import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { CurrentWorkspaceService, Workspace } from "../../../Shared/WorkspaceServices";
import { CreateItem } from "../CreateItem/Component";
import { getFooterMenu, getHeaderMenu, getMainMenu } from "../Menu";
import { Item } from "../Models";
import { ItemService } from "../Services/Item";

@Component({
  selector: "item-board",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class BoardComponent implements OnInit, OnDestroy {
  workspace!: Workspace;
  items: Item[] = [];

  constructor(
    readonly currentWorkspaceService: CurrentWorkspaceService,
    readonly itemService: ItemService,
    readonly modal: ModalService,
    readonly layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.currentWorkspaceService.workspace.subscribe((workspace) => {
      if (workspace) {
        this.workspace = workspace;
        this.#loadMenu(workspace);
        this.#loadItems(workspace.id);
      } else {
        console.log("no workspace yet...");
      }
    });
  }

  ngOnDestroy(): void {
    this.itemService.unsubscribe();
  }

  #loadMenu(workspace: Workspace) {
    if (workspace) {
      this.layoutService.updateLayout({
        header: {
          isVisible: true,
          menu: getHeaderMenu(workspace.name)
        },
        sidebar: { isVisible: false },
        sidepane: {
          isVisible: true,
          isBordered: true,
          actions: [
            {
              name: "New item",
              isActive: false,
              variant: "secondary",
              type: "action",
              action: this.openAddItem.bind(this)
            }
          ],
          mainMenu: getMainMenu(workspace.name, workspace.id),
          footerMenu: getFooterMenu(workspace.name)
        },
        nav: { isVisible: true, isBordered: true, title: `${workspace.name} Item Boards` }
      });
    }
  }

  #loadItems(workspaceId: string) {
    this.itemService.subscribe(
      {
        criteria: { workspaceId }
      },
      (items) => {
        this.items = items;
      }
    );
  }

  public openAddItem() {
    this.modal.open(CreateItem);
  }
}
