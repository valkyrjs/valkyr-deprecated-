import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Database, ModalModule } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { ButtonModule } from "@valkyr/tailwind";

import { CreateTodoDialog } from "./Dialogues/CreateTodo/Component";
import { TodoListComponent } from "./List/Component";
import { Todo } from "./Models/Todo";
import { TodoItem } from "./Models/TodoItem";
import { TodoPickerComponent } from "./Picker/Component";
import { SortTodosPipe } from "./Picker/SortTodosPipe";
import { TodoProjector } from "./Projector";
import { TodoService } from "./Services/Todo";
import { TodoItemService } from "./Services/TodoItem";
import { TodoValidator } from "./Validator";

@NgModule({
  declarations: [TodoPickerComponent, TodoListComponent, CreateTodoDialog, SortTodosPipe],
  imports: [BrowserModule, FormsModule, RouterModule, ButtonModule, ModalModule, DragDropModule],
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
    TodoValidator.register(),
    TodoProjector.register()
  ],
  exports: [TodoPickerComponent, TodoListComponent]
})
export class TodoModule {}
