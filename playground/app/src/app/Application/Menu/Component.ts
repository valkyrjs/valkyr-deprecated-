import { Component } from "@angular/core";
import { Menu, MenuService } from "@valkyr/angular";

import { MENU_AREA_SIDEBAR } from "../../Menu";

const DEFAULT_MENU: Menu = new Menu({
  id: "",
  area: MENU_AREA_SIDEBAR
});

@Component({
  selector: "v-menu",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuComponent {
  public menu: Menu = DEFAULT_MENU;

  constructor(menu: MenuService) {
    menu.subscribe(({ type, menu }) => {
      switch (type) {
        case "open": {
          this.openMenu(menu);
          break;
        }
        case "close": {
          this.closeMenu(menu);
          break;
        }
      }
    });
  }

  private openMenu(menu: Menu) {
    if (menu.area === MENU_AREA_SIDEBAR && menu.id !== this.menu?.id) {
      setTimeout(() => {
        this.menu = menu;
      }, 0);
    }
  }

  private closeMenu({ area }: Menu) {
    if (area === MENU_AREA_SIDEBAR) {
      this.menu = DEFAULT_MENU;
    }
  }
}
