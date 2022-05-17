import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "@valkyr/tailwind";

import { DesignerComponent } from "./Component";
import { DraggableComponent } from "./Draggable/Component";

@NgModule({
  imports: [BrowserModule, DragDropModule, ButtonModule],
  declarations: [DesignerComponent, DraggableComponent],
  exports: [DesignerComponent]
})
export class DesignerModule {}
