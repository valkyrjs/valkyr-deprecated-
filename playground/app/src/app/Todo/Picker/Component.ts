import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import {
  AuthService,
  DOCUMENT_TITLE,
  LedgerService,
  ParamsService,
  SubscriptionDirective,
  TitleService
} from "@valkyr/angular";
import { WorkspaceStore } from "stores";

import { Todo } from "../Models/Todo";
import { TodoService } from "../Services/Todo";

@Component({
  selector: "todo-picker",
  templateUrl: "./Template.html"
})
export class TodoPickerComponent extends SubscriptionDirective implements OnInit {
  public todos: Todo[] = [];

  public name = "";

  constructor(
    private params: ParamsService,
    private ledger: LedgerService,
    private todo: TodoService,
    private route: ActivatedRoute,
    private auth: AuthService,
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

  public openAddTodo() {}

  public async create() {
    const workspaceId = this.route.snapshot.paramMap.get("workspace");
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
}
