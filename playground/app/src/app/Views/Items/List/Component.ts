import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "@valkyr/angular";
import { LexoRank } from "lexorank";
import { ItemState } from "stores/src/Item";

import { CurrentWorkspaceService, Workspace } from "../../../Shared/WorkspaceServices";
import { Item } from "../Models";
import { ItemService } from "../Services/Item";

@Component({
  selector: "list",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ListComponent implements OnInit, OnDestroy {
  @Input("title") title!: string;
  @Input("state") state!: ItemState;

  workspace!: Workspace;
  items: Item[] = [];

  constructor(
    readonly currentWorkspaceService: CurrentWorkspaceService,
    readonly itemService: ItemService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.currentWorkspaceService.workspace.subscribe((workspace) => {
      if (!workspace) {
        throw new Error("Violation: Could not resolve current workspace");
      }
      this.workspace = workspace;
      this.loadItems(workspace.id);
    });
  }

  ngOnDestroy(): void {
    this.itemService.unsubscribe();
  }

  private loadItems(workspaceId: string) {
    this.itemService.subscribe(
      {
        criteria: { workspaceId, state: this.state }
      },
      (items) => {
        this.items = items;
      }
    );
  }

  public async drop(event: CdkDragDrop<ItemState, ItemState, Item>) {
    const member = this.workspace.members.getById(this.auth.user);
    if (!member) {
      throw new Error("Could not resolve workspace member");
    }

    if (event.previousContainer !== event.container) {
      this.itemService.setState(event.item.data.id, event.container.data, member.id);
    }

    if (event.currentIndex === event.previousIndex) {
      return;
    }

    let newOrder: string | undefined;
    if (event.currentIndex === 0) {
      const itemAfter = this.items[event.currentIndex];
      newOrder = LexoRank.parse(itemAfter.sort).genPrev().toString();
    } else if (event.currentIndex === this.items.length - 1) {
      const itemBefore = this.items[event.currentIndex];
      newOrder = LexoRank.parse(itemBefore.sort).genNext().toString();
    } else {
      const indexBefore = event.currentIndex < event.previousIndex ? event.currentIndex - 1 : event.currentIndex;
      const indexAfter = event.currentIndex < event.previousIndex ? event.currentIndex : event.currentIndex + 1;
      const itemBefore = this.items[indexBefore];
      const itemAfter = this.items[indexAfter];
      newOrder = LexoRank.parse(itemBefore.sort).between(LexoRank.parse(itemAfter.sort)).toString();
    }
    this.itemService.setOrder(event.item.data.id, newOrder, member.id);
  }
}
