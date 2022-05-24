import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TodoListComponent } from "./List/Component";
import { TodoPickerComponent } from "./Picker/Component";

const routes: Routes = [
  {
    path: "",
    component: TodoPickerComponent
  },
  { path: ":todo", component: TodoListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}
