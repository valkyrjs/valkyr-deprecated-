import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ButtonComponent } from "./Component";

@NgModule({
  declarations: [ButtonComponent],
  imports: [BrowserModule, RouterModule],
  exports: [ButtonComponent]
})
export class ButtonModule {}
