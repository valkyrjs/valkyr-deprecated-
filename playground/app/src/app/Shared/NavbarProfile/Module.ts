import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IconModule } from "@valkyr/tailwind";

import { NavbarProfileComponent } from "./Component";

@NgModule({
  declarations: [NavbarProfileComponent],
  imports: [CommonModule, RouterModule, IconModule],
  exports: [NavbarProfileComponent]
})
export class NavbarProfileModule {}
