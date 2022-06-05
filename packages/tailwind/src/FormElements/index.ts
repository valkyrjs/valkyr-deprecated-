import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CheckboxComponent } from "./Checkbox";

@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, RouterModule],
  exports: [CheckboxComponent]
})
export class ElementsModule {}
