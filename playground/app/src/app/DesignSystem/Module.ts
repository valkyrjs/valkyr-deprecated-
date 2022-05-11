import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { DesignSystemComponent } from "./Component";

@NgModule({
  declarations: [DesignSystemComponent],
  imports: [BrowserModule],
  exports: [DesignSystemComponent]
})
export class DesignSystemModule {}
