import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule, IconModule, SelectModule } from "@valkyr/tailwind";

import { DesignSystemComponent } from "./Component";

@NgModule({
  declarations: [DesignSystemComponent],
  imports: [BrowserModule, ButtonModule, SelectModule, IconModule],
  exports: [DesignSystemComponent]
})
export class DesignSystemModule {}
