import { Component, OnInit } from "@angular/core";
import { AuthService } from "@valkyr/angular";
import { ModalService } from "@valkyr/tailwind";

import { CurrentWorkspaceService, Workspace } from "../../../Shared/WorkspaceServices";
import { ItemService } from "../Services/Item";

@Component({
  templateUrl: "./Template.html"
})
export class CreateItem implements OnInit {
  workspace!: Workspace;
  name = "";

  constructor(
    private currentWorkspace: CurrentWorkspaceService,
    private auth: AuthService,
    private modal: ModalService,
    private item: ItemService
  ) {}

  ngOnInit(): void {
    this.currentWorkspace.workspace.subscribe((workspace) => {
      if (workspace) {
        this.workspace = workspace;
      }
    });
  }

  async create() {
    this.close();
    if (!this.workspace) {
      throw new Error("Could not resolve workspace id");
    }
    const member = this.workspace.members.getById(this.auth.user);
    if (!member) {
      throw new Error("Could not resolve workspace member");
    }
    this.item.create(this.workspace.id, this.name, member.id);
  }

  cancel() {
    this.close();
  }

  close() {
    this.modal.close();
  }
}
