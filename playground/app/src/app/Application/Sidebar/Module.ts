import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { SidebarComponent } from "./Component";
import { MenuComponent } from "./Menu/Component";
import { MenuCategoryComponent } from "./MenuCategory/Component";
import { MenuItemComponent } from "./MenuItem/Component";

@NgModule({
  declarations: [SidebarComponent, MenuComponent, MenuCategoryComponent, MenuItemComponent],
  imports: [BrowserModule, RouterModule],
  exports: [SidebarComponent]
})
export class SidebarModule {}
