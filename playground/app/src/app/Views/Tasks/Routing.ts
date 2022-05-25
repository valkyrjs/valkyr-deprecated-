import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TodoItemComponent } from "./Item/Component";
import { TodoListComponent } from "./List/Component";

const routes: Routes = [
  { path: "", component: TodoListComponent },
  { path: ":todo", component: TodoItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}
