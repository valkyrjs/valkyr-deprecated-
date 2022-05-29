import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";

import { IconComponent } from "./Component";

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule {}
