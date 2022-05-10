import { Component, Injector, OnInit } from "@angular/core";
import { DataSubscriber, DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { WorkspaceSelectorService } from "src/app/Workspace/Services/WorkspaceSelectorService";

import { Workspace } from "../../Workspace/Models/Workspace";
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
    readonly title: TitleService,
    injector: Injector
  ) {
    super(injector);
    title.set("Todos", DOCUMENT_TITLE, "workspace");
  }

  ngOnInit(): void {
    const workspaceId = this.workspace.current;
    if (!workspaceId) {
      throw new Error("TodoPickerComponent Violation: Could not resolve current workspace");
    }
    this.#loadWorkspace(workspaceId);
    this.#loadTodos(workspaceId);
  }

  #loadWorkspace(workspaceId: string) {
    this.subscribe(Workspace, { criteria: { id: workspaceId }, limit: 1 }, (workspace) => {
      if (workspace) {
        this.title.set(`${workspace.name} Todos`, DOCUMENT_TITLE, "workspace");
      }
    });
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
