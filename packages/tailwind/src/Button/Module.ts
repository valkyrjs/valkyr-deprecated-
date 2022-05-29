import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ButtonComponent } from "./Component";

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, RouterModule],
  exports: [ButtonComponent]
})
export class ButtonModule {}
