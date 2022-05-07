import { Component } from "@angular/core";
import { Menu, MenuService } from "@valkyr/angular";

const MENU_AREA = "sidebar-left-main";

const DEFAULT_MENU: Menu = {
  id: "",
  type: "default",
  area: MENU_AREA,
  categories: []
};

@Component({
  selector: "menu",
  templateUrl: "./Template.html"
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
        }
      }
    });
  }

  private openMenu(menu: Menu) {
    if (menu.area === MENU_AREA && menu.id !== this.menu?.id) {
      setTimeout(() => {
        this.menu = menu;
      }, 0);
    }
  }

  private closeMenu({ area }: Menu) {
    if (area === MENU_AREA) {
      this.menu = DEFAULT_MENU;
    }
  }
}
