import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ApplicationComponent } from "./Component";

@NgModule({
  declarations: [ApplicationComponent],
  imports: [BrowserModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ApplicationComponent]
})
export class ApplicationModule {}
