import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "navbar-links",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class NavbarLinksComponent implements OnInit {
  public links = [
    { name: "Workspaces", heading: "My Workspaces", href: "/workspaces" },
    { name: "Lists", heading: "My Lists", href: "/lists" },
    { name: "Items", heading: "My Items", href: "/items" }
  ];

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {}

  public isCurrentRoute(route: string): boolean {
    return this.route.snapshot.url.some((u) => route.includes(u.path));
  }
}
