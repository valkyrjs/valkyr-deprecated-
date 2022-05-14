import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule, SelectModule } from "@valkyr/tailwind";

import { DesignSystemComponent } from "./Component";

@NgModule({
  declarations: [DesignSystemComponent],
  imports: [BrowserModule, ButtonModule, SelectModule],
  exports: [DesignSystemComponent]
})
export class DesignSystemModule {}
