import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SelectComponent } from "./Component";

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, RouterModule],
  exports: [SelectComponent]
})
export class SelectModule {}
