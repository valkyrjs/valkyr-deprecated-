import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { TextEditorComponent } from "./Component";

@NgModule({
  declarations: [TextEditorComponent],
  imports: [BrowserModule],
  exports: [TextEditorComponent]
})
export class TextEditorModule {}
