import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ModalModule } from "@valkyr/angular";

import { CreateTodoDialog } from "./Dialogues/CreateTodo/Component";
import { TodoListComponent } from "./List/Component";
import { TodoPickerComponent } from "./Picker/Component";
import { TodoProjector } from "./Projector";
import { TodoService } from "./Services/Todo";
import { TodoItemService } from "./Services/TodoItem";

@NgModule({
  declarations: [TodoPickerComponent, TodoListComponent, CreateTodoDialog],
  imports: [BrowserModule, FormsModule, RouterModule, ModalModule],
  providers: [TodoService, TodoItemService, TodoProjector.register()],
  exports: [TodoPickerComponent, TodoListComponent]
})
export class TodoModule {}
