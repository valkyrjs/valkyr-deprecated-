import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService, LedgerService, ParamsService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { WorkspaceStore } from "stores";

import { LayoutService } from "../../../Shared/Layout/Services/LayoutService";
import { WorkspaceService } from "../../../Shared/WorkspaceServices";
import { CreateTodoDialog } from "../Dialogues/CreateTodo/Component";
import { getFooterMenu, getHeaderMenu, getMainMenu } from "../Menu";
import { Todo } from "../Models";
import { TodoService } from "../Services/Todo";

@Component({
  selector: "todo-list",
  templateUrl: "./Template.html"
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];

  name = "";

  constructor(
    readonly workspace: WorkspaceService,
    readonly todoService: TodoService,
    readonly ledger: LedgerService,
    readonly modal: ModalService,
    readonly layoutService: LayoutService,
    readonly params: ParamsService,
    readonly route: ActivatedRoute,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    const workspaceId = this.workspace.selected;
    if (!workspaceId) {
      throw new Error("TodoListComponent Violation: Could not resolve current workspace");
    }
    this.#loadWorkspace(workspaceId);
    this.#loadTodos(workspaceId);
  }

  ngOnDestroy(): void {
    this.workspace.unsubscribe(this);
    this.todoService.unsubscribe(this);
  }

  #loadWorkspace(workspaceId: string) {
    this.workspace.subscribe(this, { criteria: { id: workspaceId }, limit: 1 }, (workspace) => {
      if (workspace) {
        this.layoutService.updateLayout({
          header: {
            isVisible: true,
            menu: getHeaderMenu()
          },
          sidebar: { isVisible: false },
          sidepane: {
            isVisible: true,
            isBordered: true,
            actions: [{ name: "New board", variant: "secondary", type: "action", action: this.openAddTodo.bind(this) }],
            mainMenu: getMainMenu(workspaceId),
            footerMenu: getFooterMenu()
          },
          nav: { isVisible: true, isBordered: true, title: `${workspace.name} Todo Boards` }
        });
      }
    });
  }

  #loadTodos(workspaceId: string) {
    this.todoService.subscribe(
      this,
      {
        criteria: { workspaceId }
      },
      (todos) => {
        this.todos = todos;
      }
    );
  }

  public openAddTodo() {
    this.modal.open(CreateTodoDialog);
  }

  public async drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      if (!this.workspace.selected) {
        throw new Error("Could not resolve workspace id");
      }
      const workspace = await this.ledger.reduce(this.workspace.selected, WorkspaceStore.Workspace);
      if (!workspace) {
        throw new Error("Could not resolve workspace");
      }
      const member = workspace.members.getById(this.auth.auditor);
      if (!member) {
        throw new Error("Could not resolve workspace member");
      }
      this.todoService.move(event.item.data.id, event.currentIndex, member.id);
    }
  }
}
