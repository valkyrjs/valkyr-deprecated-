import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ButtonModule, IconModule, SelectModule } from "@valkyr/tailwind";

import { DesignSystemComponent } from "./Component";
import { DesignSystemRoutingModule } from "./Routing";

@NgModule({
  declarations: [DesignSystemComponent],
  imports: [ButtonModule, SelectModule, IconModule, CommonModule],
  exports: [DesignSystemComponent, DesignSystemRoutingModule]
})
export class DesignSystemModule {}
