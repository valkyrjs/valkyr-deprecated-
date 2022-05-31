import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "@valkyr/angular";
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

  public async drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      const member = this.workspace.members.getById(this.auth.user);
      if (!member) {
        throw new Error("Could not resolve workspace member");
      }
      this.itemService.move(event.item.data.id, event.currentIndex, member.id);
    }
  }
}
