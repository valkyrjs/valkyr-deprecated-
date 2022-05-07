import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { NavbarComponent } from "./Component";
import { NavbarLinksComponent } from "./Links/Component";
import { NavbarLogoComponent } from "./Logo/Component";
import { NavbarProfileComponent } from "./Profile/Component";

@NgModule({
  declarations: [NavbarComponent, NavbarLogoComponent, NavbarLinksComponent, NavbarProfileComponent],
  imports: [BrowserModule, RouterModule],
  exports: [NavbarComponent]
})
export class NavbarModule {}
