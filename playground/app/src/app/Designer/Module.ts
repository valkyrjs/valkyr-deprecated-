import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { DesignerComponent } from "./Component";
import { DraggableComponent } from "./Draggable/Component";

@NgModule({
  imports: [BrowserModule, DragDropModule],
  declarations: [DesignerComponent, DraggableComponent],
  exports: [DesignerComponent]
})
export class DesignerModule {}
