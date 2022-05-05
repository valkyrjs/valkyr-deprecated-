import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { TextEditorComponent } from "./Editor/Component";

@NgModule({
  declarations: [TextEditorComponent],
  imports: [BrowserModule],
  exports: [TextEditorComponent]
})
export class TextEditorModule {}
