import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "@valkyr/tailwind";

import { DesignSystemComponent } from "./Component";

@NgModule({
  declarations: [DesignSystemComponent],
  imports: [BrowserModule, ButtonModule],
  exports: [DesignSystemComponent]
})
export class DesignSystemModule {}
