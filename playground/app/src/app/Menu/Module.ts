import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { MenuComponent } from "./Component";
import { MainMenuComponent } from "./MainMenu/Component";
import { MenuCategoryComponent } from "./MenuCategory/Component";
import { MenuItemComponent } from "./MenuItem/Component";
import { MenuListComponent } from "./MenuList/Component";
import { SecondaryMenuComponent } from "./SecondaryMenu/Component";

@NgModule({
  declarations: [
    MenuComponent,
    MainMenuComponent,
    SecondaryMenuComponent,
    MenuListComponent,
    MenuCategoryComponent,
    MenuItemComponent
  ],
  imports: [BrowserModule, RouterModule],
  exports: [MenuComponent]
})
export class MenuModule {}
