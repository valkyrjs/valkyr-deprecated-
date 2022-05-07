import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { NavbarComponent } from "./Component";
import { NavbarLinksComponent } from "./Links/Component";
import { NavbarProfileComponent } from "./Profile/Component";

@NgModule({
  declarations: [NavbarComponent, NavbarLinksComponent, NavbarProfileComponent],
  imports: [BrowserModule, RouterModule],
  exports: [NavbarComponent]
})
export class NavbarModule {}
