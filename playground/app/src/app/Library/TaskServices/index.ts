import { NgModule } from "@angular/core";
import { Database } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Todo } from "./Models/Todo";
import { TodoItem } from "./Models/TodoItem";
import { TodoProjector } from "./Projector";
import { TodoService } from "./Services/Todo";
import { TodoItemService } from "./Services/TodoItem";
import { TodoItemSubscriberService } from "./Services/TodoItemSubscriber";
import { TodoValidator } from "./Validator";

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    Database.for([
      {
        model: Todo,
        collection: new Collection("todos", new IndexedDbAdapter())
      },
      {
        model: TodoItem,
        collection: new Collection("todos", new IndexedDbAdapter())
      }
    ]),
    TodoService,
    TodoItemService,
    TodoItemSubscriberService,
    TodoValidator.register(),
    TodoProjector.register()
  ]
})
export class TaskServicesModule {}

export * from "./Models";
