import { Component, Input } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { MenuItem } from "../../Models/MenuItem";

@Component({
  selector: "app-menu-list",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuListComponent {
  @Input("items") public items!: MenuItem[];
  activeItem = "/";

  constructor(private router: Router) {
    this.activeItem = router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeItem = event.url;
      }
    });
  }

  isActive(item: MenuItem): boolean {
    return item.href ? this.activeItem === item.href : false;
  }
}
