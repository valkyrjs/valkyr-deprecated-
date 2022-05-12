import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService, DOCUMENT_TITLE, LedgerService, ParamsService, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { WorkspaceStore } from "stores";

import { WorkspaceService } from "../../Workspace";
import { CreateTodoDialog } from "../Dialogues/CreateTodo/Component";
import { Todo } from "../Models/Todo";
import { TodoService } from "../Services/Todo";
import { TodoItemService } from "../Services/TodoItem";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];

  name = "";

  constructor(
    readonly workspace: WorkspaceService,
    readonly todo: TodoService,
    readonly ledger: LedgerService,
    readonly modal: ModalService,
    readonly title: TitleService,
    readonly params: ParamsService,
    readonly route: ActivatedRoute,
    readonly todoItem: TodoItemService,
    readonly auth: AuthService
  ) {
    title.set("Todos", DOCUMENT_TITLE, "workspace");
  }

  ngOnInit(): void {
    const workspaceId = this.workspace.selected;
    if (!workspaceId) {
      throw new Error("TodoPickerComponent Violation: Could not resolve current workspace");
    }
    this.#loadWorkspace(workspaceId);
    this.#loadTodos(workspaceId);
  }

  ngOnDestroy(): void {
    this.workspace.unsubscribe(this);
    this.todo.unsubscribe(this);
  }

  #loadWorkspace(workspaceId: string) {
    this.workspace.subscribe(this, { criteria: { id: workspaceId }, limit: 1 }, (workspace) => {
      if (workspace) {
        this.title.set(`${workspace.name} Todos`, DOCUMENT_TITLE, "workspace");
      }
    });
  }

  #loadTodos(workspaceId: string) {
    this.todo.subscribe(
      this,
      {
        criteria: { workspaceId },
        stream: {
          aggregate: "todo",
          endpoint: `/workspaces/${workspaceId}/todos`
        }
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
      const member = workspace.members.getByAccount(this.auth.auditor);
      if (!member) {
        throw new Error("Could not resolve workspace member");
      }
      this.todoItem.move(this.workspace.selected, event.item.data.id, event.currentIndex, member.id);
    }
  }
}
