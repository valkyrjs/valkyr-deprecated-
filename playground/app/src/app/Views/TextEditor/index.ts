import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TextEditorComponent } from "./Component";
import { TextEditorRoutingModule } from "./Routing";

@NgModule({
  declarations: [TextEditorComponent],
  imports: [CommonModule, TextEditorRoutingModule]
})
export class TextEditorModule {}
