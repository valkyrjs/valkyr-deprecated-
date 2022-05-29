import { Inject, Injectable } from "@angular/core";
import { DataSubscriberService, StreamService } from "@valkyr/angular";

import { Todo, TodoModel } from "../Models/Todo";

@Injectable({ providedIn: "root" })
export class TodoSubscriberService extends DataSubscriberService<TodoModel> {
  constructor(@Inject(Todo) readonly model: TodoModel, readonly stream: StreamService) {
    super();
  }
}
