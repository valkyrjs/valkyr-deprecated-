import { Component, Inject } from "@angular/core";
import { AuthService, LedgerService } from "@valkyr/angular";
import { MODAL_CONTEXT_TOKEN, ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { WorkspaceStore } from "stores";

import { TodoService } from "../../Services/Todo";

@Component({
  templateUrl: "./Template.html"
})
export class CreateTodoDialog {
  public name = "";

  constructor(
    @Inject(MODAL_CONTEXT_TOKEN) private context: { workspaceId: string },
    private modal: ModalService,
    private ledger: LedgerService,
    private todo: TodoService,
    private auth: AuthService
  ) {}

  public async create() {
    this.close();
    const workspaceId = this.context.workspaceId;
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

  public close() {
    this.modal.close();
  }
}
