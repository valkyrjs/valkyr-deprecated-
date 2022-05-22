import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { IconModule } from "../Icon";
import { MenuCategoryComponent } from "./Category/Component";
import { MenuComponent } from "./Component";
import { MenuItemActionComponent } from "./ItemAction/Component";
import { MenuItemLinkComponent } from "./ItemLink/Component";
import { MenuListComponent } from "./List/Component";

@NgModule({
  imports: [BrowserModule, RouterModule, IconModule],
  declarations: [
    MenuComponent,
    MenuListComponent,
    MenuCategoryComponent,
    MenuItemLinkComponent,
    MenuItemActionComponent
  ],
  exports: [MenuComponent, MenuListComponent, MenuCategoryComponent, MenuItemActionComponent, MenuItemLinkComponent]
})
export class MenuModule {}
