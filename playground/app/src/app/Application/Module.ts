import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ApplicationComponent } from "./Component";
import { ContentModule } from "./Content/Module";
import { MenuModule } from "./Menu/Module";
import { NavbarModule } from "./Navbar/Module";
import { TitleModule } from "./Title/Module";

@NgModule({
  declarations: [ApplicationComponent],
  imports: [BrowserModule, FormsModule, RouterModule, NavbarModule, TitleModule, MenuModule, ContentModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ApplicationComponent]
})
export class ApplicationModule {}
