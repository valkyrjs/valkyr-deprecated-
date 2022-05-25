import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";

import { TodoItem } from "../Models";
import { TodoService } from "../Services/Todo";
import { TodoItemService } from "../Services/TodoItem";

@Component({
  selector: "todo-item",
  templateUrl: "./Template.html"
})
export class TodoItemComponent implements OnInit, OnDestroy {
  items: TodoItem[] = [];

  constructor(
    readonly todo: TodoService,
    readonly item: TodoItemService,
    readonly route: ActivatedRoute,
    readonly title: TitleService
  ) {}

  ngOnInit(): void {
    const todoId = this.route.snapshot.paramMap.get("todo");
    if (!todoId) {
      throw new Error("TodoItemComponent Violation: Could not resolve todo id");
    }
    this.#loadTodo(todoId);
    this.#loadTodoList(todoId);
  }

  ngOnDestroy(): void {
    this.todo.unsubscribe(this);
    this.item.unsubscribe(this);
  }

  #loadTodo(todoId: string) {
    this.todo.subscribe(
      this,
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
    this.item.subscribe(
      this,
      {
        criteria: { todoId }
      },
      (items) => {
        this.items = items;
      }
    );
  }
}
