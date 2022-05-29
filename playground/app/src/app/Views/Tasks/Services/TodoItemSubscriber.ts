import { Inject, Injectable } from "@angular/core";
import { DataSubscriberService, StreamService } from "@valkyr/angular";

import { TodoItem, TodoItemModel } from "../Models/TodoItem";

@Injectable({ providedIn: "root" })
export class TodoItemSubscriberService extends DataSubscriberService<TodoItemModel> {
  constructor(@Inject(TodoItem) readonly model: TodoItemModel, readonly stream: StreamService) {
    super();
  }
}
