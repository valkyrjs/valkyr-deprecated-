import { Component, Injector, OnInit } from "@angular/core";
import { AuthService, SubscriptionDirective } from "@valkyr/angular";

@Component({
  selector: "navbar-links",
  templateUrl: "./Template.html"
})
export class NavbarLinksComponent extends SubscriptionDirective implements OnInit {
  public links = [
    {
      name: "Templates",
      href: "/templates"
    }
  ];

  constructor(private auth: AuthService, injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    // ...
  }

  public isCurrentRoute(route: string): boolean {
    return route === "/workspaces";
  }
}
