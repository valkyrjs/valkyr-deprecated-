import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule, IconModule } from "@valkyr/tailwind";

import { NavbarProfileModule } from "../NavbarProfile";
import { ContentComponent } from "./Components/Content/Component";
import { HeaderComponent } from "./Components/Header/Component";
import { MenuCategoriesComponent } from "./Components/MenuCategories/Component";
import { MenuCategoryComponent } from "./Components/MenuCategory/Component";
import { MenuItemActionLinkComponent } from "./Components/MenuItemActionLink/Component";
import { MenuItemLinkComponent } from "./Components/MenuItemLink/Component";
import { MenuListComponent } from "./Components/MenuList/Component";
import { NavbarLinkComponent } from "./Components/NavbarLink/Component";
import { NavbarLinksComponent } from "./Components/NavbarLinks/Component";
import { SidebarComponent } from "./Components/Sidebar/Component";
import { SmallSidebarComponent } from "./Components/SmallSidebar/Component";
import { ViewComponent } from "./Components/View/Component";
import { LayoutService } from "./Services/LayoutService";

@NgModule({
  imports: [CommonModule, ButtonModule, RouterModule, NavbarProfileModule, IconModule],
  declarations: [
    ContentComponent,
    HeaderComponent,
    MenuCategoriesComponent,
    MenuCategoryComponent,
    MenuItemActionLinkComponent,
    MenuItemLinkComponent,
    MenuListComponent,
    NavbarLinkComponent,
    NavbarLinksComponent,
    SidebarComponent,
    SmallSidebarComponent,
    ViewComponent
  ],
  exports: [ViewComponent],
  providers: [LayoutService]
})
export class LayoutModule {
  constructor(@Optional() @SkipSelf() parentModule?: LayoutModule) {
    if (parentModule) {
      throw new Error("LayoutModule is already loaded. Import it in the AppModule only");
    }
  }
}
