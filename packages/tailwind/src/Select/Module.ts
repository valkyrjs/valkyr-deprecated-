import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { SelectComponent } from "./Component";

@NgModule({
  declarations: [SelectComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule],
  exports: [SelectComponent]
})
export class SelectModule {}
