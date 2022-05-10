import { Component, Injector, OnInit } from "@angular/core";
import { DataSubscriber, DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { WorkspaceSelectorService } from "src/app/Workspace/Services/WorkspaceSelectorService";

import { CreateTodoDialog } from "../Dialogues/CreateTodo/Component";
import { Todo } from "../Models/Todo";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent extends DataSubscriber implements OnInit {
  public todos: Todo[] = [];

  public name = "";

  constructor(
    readonly workspace: WorkspaceSelectorService,
    readonly modal: ModalService,
    title: TitleService,
    injector: Injector
  ) {
    super(injector);
    title.set("Todos", DOCUMENT_TITLE, "application");
  }

  ngOnInit(): void {
    const workspaceId = this.workspace.current;
    if (!workspaceId) {
      throw new Error("Todo Violation: Could not resolve current workspace");
    }
    this.#loadTodos(workspaceId);
  }

  #loadTodos(workspaceId: string) {
    this.subscribe(
      Todo,
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
