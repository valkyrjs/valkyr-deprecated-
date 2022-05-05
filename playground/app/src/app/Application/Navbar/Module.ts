import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { NavbarComponent } from "./Component";
import { NavbarLogoComponent } from "./Logo/Component";
import { NavbarProfileComponent } from "./Profile/Component";

@NgModule({
  declarations: [NavbarComponent, NavbarLogoComponent, NavbarProfileComponent],
  imports: [BrowserModule, RouterModule],
  exports: [NavbarComponent]
})
export class NavbarModule {}
