import { Component } from "@angular/core";
import { AuthService, LedgerService } from "@valkyr/angular";
import { ModalService } from "@valkyr/tailwind";
import { WorkspaceStore } from "stores";

import { WorkspaceService } from "../../../../Shared/WorkspaceServices";
import { TodoService } from "../../Services/Todo";

@Component({
  templateUrl: "./Template.html"
})
export class CreateTodoDialog {
  name = "";

  constructor(
    private auth: AuthService,
    private ledger: LedgerService,
    private modal: ModalService,
    private todo: TodoService,
    readonly workspace: WorkspaceService
  ) {}

  async create() {
    this.close();
    const workspaceId = this.workspace.selected;
    if (!workspaceId) {
      throw new Error("Could not resolve workspace id");
    }
    const workspace = await this.ledger.reduce(workspaceId, WorkspaceStore.Workspace);
    if (!workspace) {
      throw new Error("Could not resolve workspace");
    }
    const member = workspace.members.getById(this.auth.user);
    if (!member) {
      throw new Error("Could not resolve workspace member");
    }
    this.todo.create(workspaceId, this.name, member.id);
  }

  cancel() {
    this.close();
  }

  close() {
    this.modal.close();
  }
}
