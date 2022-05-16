import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { MenuCategoryComponent } from "./Category/Component";
import { MenuComponent } from "./Component";
import { MenuItemComponent } from "./Item/Component";
import { MenuListComponent } from "./List/Component";

@NgModule({
  declarations: [MenuComponent, MenuListComponent, MenuCategoryComponent, MenuItemComponent],
  imports: [BrowserModule, RouterModule],
  exports: [MenuComponent, MenuListComponent, MenuCategoryComponent, MenuItemComponent]
})
export class MenuModule {}
