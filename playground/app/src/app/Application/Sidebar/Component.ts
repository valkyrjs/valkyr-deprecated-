import { Component } from "@angular/core";

import { Menu, menu } from "./Menu";

@Component({
  selector: "app-sidebar",
  templateUrl: "./Template.html"
})
export class SidebarComponent {
  public menu: Menu = menu;
}
