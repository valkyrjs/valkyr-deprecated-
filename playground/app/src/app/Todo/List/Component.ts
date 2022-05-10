import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataSubscriber, DOCUMENT_TITLE, TitleService } from "@valkyr/angular";

import { Todo } from "../Models/Todo";
import { TodoItem } from "../Models/TodoItem";

@Component({
  selector: "todo-list",
  templateUrl: "./Template.html"
})
export class TodoListComponent extends DataSubscriber implements OnInit {
  items: TodoItem[] = [];

  constructor(readonly route: ActivatedRoute, readonly title: TitleService, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    const todoId = this.route.snapshot.paramMap.get("todo");
    if (!todoId) {
      throw new Error("TodoListComponent Violation: Could not resolve todo id");
    }
    this.#loadTodo(todoId);
    this.#loadTodoList(todoId);
  }

  #loadTodo(todoId: string) {
    this.subscribe(
      Todo,
      {
        criteria: { id: todoId },
        limit: 1,
        stream: {
          aggregate: "todo",
          streamIds: [todoId]
        }
      },
      (todo) => {
        if (todo) {
          this.title.set(`${todo.name} Todo`, DOCUMENT_TITLE, "workspace");
        }
      }
    );
  }

  #loadTodoList(todoId: string) {
    this.subscribe(
      TodoItem,
      {
        criteria: { todoId }
      },
      (items) => {
        this.items = items;
      }
    );
  }
}
