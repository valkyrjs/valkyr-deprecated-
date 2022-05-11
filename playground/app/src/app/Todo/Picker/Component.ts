import { Component, OnDestroy, OnInit } from "@angular/core";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular";

import { WorkspaceService } from "../../Workspace";
import { CreateTodoDialog } from "../Dialogues/CreateTodo/Component";
import { Todo } from "../Models/Todo";
import { TodoService } from "../Services/Todo";

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
    readonly modal: ModalService,
    readonly title: TitleService
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
}
