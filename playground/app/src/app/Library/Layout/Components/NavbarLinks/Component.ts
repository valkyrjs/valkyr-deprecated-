import { Component, Input } from "@angular/core";
import {  NavigationEnd, Router } from "@angular/router";

import { MenuItem } from "../../Models/MenuItem";

@Component({
  selector: "app-navbar-links",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class NavbarLinksComponent {
  @Input("menu") menu?: MenuItem[];
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
