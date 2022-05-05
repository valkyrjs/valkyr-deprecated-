import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ContentComponent } from "./Component";

@NgModule({
  declarations: [ContentComponent],
  imports: [BrowserModule, RouterModule],
  exports: [ContentComponent]
})
export class ContentModule {}
