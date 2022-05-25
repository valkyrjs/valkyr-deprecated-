import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ModalModule } from "@valkyr/angular";
import { Database } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { ButtonModule, IconModule } from "@valkyr/tailwind";

import { CreateTodoDialog } from "./Dialogues/CreateTodo/Component";
import { TodoItemComponent } from "./Item/Component";
import { TodoListComponent } from "./List/Component";
import { SortTodosPipe } from "./List/SortTodosPipe";
import { Todo } from "./Models/Todo";
import { TodoItem } from "./Models/TodoItem";
import { TodoProjector } from "./Projector";
import { TodoRoutingModule } from "./Routing";
import { TodoService } from "./Services/Todo";
import { TodoItemService } from "./Services/TodoItem";
import { TodoItemSubscriberService } from "./Services/TodoItemSubscriber";
import { TodoValidator } from "./Validator";

@NgModule({
  declarations: [TodoItemComponent, TodoListComponent, CreateTodoDialog, SortTodosPipe],
  imports: [CommonModule, IconModule, FormsModule, RouterModule, ButtonModule, ModalModule, DragDropModule],
  exports: [TodoItemComponent, TodoListComponent, TodoRoutingModule],
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
export class TasksModule {}

export * from "./Models";
