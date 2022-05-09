import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DataSubscriber, DOCUMENT_TITLE, ParamsService, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";

import { CreateTodoDialog } from "../Dialogues/CreateTodo/Component";
import { Todo } from "../Models/Todo";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent extends DataSubscriber implements OnInit {
  public todos: Todo[] = [];

  public name = "";

  #workspaceId?: string;

  constructor(
    private modal: ModalService,
    private params: ParamsService,
    private route: ActivatedRoute,
    title: TitleService,
    injector: Injector
  ) {
    super(injector);
    title.set("Todos", DOCUMENT_TITLE, "application");
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const id = params.get("workspace")!;
        this.#workspaceId = id;
        this.getTodos(id);
        this.params.next(params);
      }
    });
  }

  public getTodos(workspaceId: string) {
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
    this.modal.open(CreateTodoDialog, { workspaceId: this.#workspaceId });
  }
}
