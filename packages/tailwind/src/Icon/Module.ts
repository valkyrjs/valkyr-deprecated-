import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";

import { IconComponent } from "./Component";

@NgModule({
  imports: [BrowserModule, RouterModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule {}
