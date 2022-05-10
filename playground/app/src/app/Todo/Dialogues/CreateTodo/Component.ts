import { Component } from "@angular/core";
import { AuthService, LedgerService, ModalService } from "@valkyr/angular";
import { WorkspaceSelectorService } from "src/app/Workspace/Services/WorkspaceSelectorService";
import { WorkspaceStore } from "stores";

import { TodoService } from "../../Services/Todo";

@Component({
  templateUrl: "./Template.html"
})
export class CreateTodoDialog {
  name = "";

  constructor(
    private modal: ModalService,
    private ledger: LedgerService,
    private todo: TodoService,
    private auth: AuthService,
    private selector: WorkspaceSelectorService
  ) {}

  async create() {
    this.close();
    const workspaceId = this.selector.current;
    if (!workspaceId) {
      throw new Error("Could not resolve workspace id");
    }
    const workspace = await this.ledger.reduce(workspaceId, WorkspaceStore.Workspace);
    if (!workspace) {
      throw new Error("Could not resolve workspace");
    }
    const member = workspace.members.getByAccount(this.auth.auditor);
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
