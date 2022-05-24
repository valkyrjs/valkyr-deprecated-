import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { MenuItem } from "../../Models/MenuItem";

@Component({
  selector: "app-navbar-links",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class NavbarLinksComponent implements OnInit {
  @Input("menu") menu?: MenuItem[];

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {}

  public isCurrentRoute(route: string): boolean {
    return this.route.snapshot.url.some((u) => route.includes(u.path));
  }
}
