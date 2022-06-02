import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalService } from "@valkyr/tailwind";

import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { CurrentWorkspaceService, Workspace } from "../../../Shared/WorkspaceServices";
import { CreateItem } from "../CreateItem/Component";
import { getFooterMenu, getHeaderMenu, getMainMenu, getNav, getSidebar, getSidepane } from "../Menu";
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
        this.itemService.unsubscribe();
        this.itemService.subscribe({ criteria: { workspaceId: workspace.id } }, (items) => {
          this.items = items;
        });

        this.layoutService.updateLayout({
          header: getHeaderMenu(workspace.name),
          nav: getNav(`${workspace.name} Board`),
          sidebar: getSidebar(),
          sidepane: getSidepane(workspace.name, "/boards", [
            {
              name: "New item",
              isActive: false,
              variant: "secondary",
              type: "action",
              action: this.openAddItem.bind(this)
            }
          ])
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.itemService.unsubscribe();
  }

  public openAddItem() {
    this.modal.open(CreateItem);
  }
}
