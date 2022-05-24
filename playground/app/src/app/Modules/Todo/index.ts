import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ModalModule } from "@valkyr/angular";
import { ButtonModule, IconModule } from "@valkyr/tailwind";

import { CreateTodoDialog } from "./Dialogues/CreateTodo/Component";
import { TodoItemComponent } from "./Item/Component";
import { TodoListComponent } from "./List/Component";
import { SortTodosPipe } from "./List/SortTodosPipe";
import { TodoRoutingModule } from "./Routing";

@NgModule({
  declarations: [TodoItemComponent, TodoListComponent, CreateTodoDialog, SortTodosPipe],
  imports: [CommonModule, IconModule, FormsModule, RouterModule, ButtonModule, ModalModule, DragDropModule],
  exports: [TodoItemComponent, TodoListComponent, TodoRoutingModule]
})
export class TodoModule {}
