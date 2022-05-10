import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { MenuModule } from "../Menu/Module";
import { NavbarModule } from "../Navbar/Module";
import { TitleModule } from "../Title/Module";
import { DiscoveryComponent } from "./Component";

@NgModule({
  declarations: [DiscoveryComponent],
  imports: [BrowserModule, FormsModule, RouterModule, NavbarModule, TitleModule, MenuModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DiscoveryComponent]
})
export class DiscoveryModule {}
