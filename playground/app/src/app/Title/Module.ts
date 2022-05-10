import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { TitleComponent } from "./Component";

@NgModule({
  declarations: [TitleComponent],
  imports: [BrowserModule, RouterModule],
  exports: [TitleComponent]
})
export class TitleModule {}
