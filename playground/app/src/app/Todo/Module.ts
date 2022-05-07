import { NgModule } from "@angular/core";

import { TodoListComponent } from "./List/Component";
import { TodoPickerComponent } from "./Picker/Component";

@NgModule({
  declarations: [TodoPickerComponent, TodoListComponent],
  exports: [TodoPickerComponent, TodoListComponent]
})
export class TodoModule {}
