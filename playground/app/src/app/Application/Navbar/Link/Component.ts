import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "[navbar-link]",
  templateUrl: "./Template.html"
})
export class NavbarLinkComponent {
  @Input("name") public name!: string;
  @Input("link") public link!: string;

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {}

  public isCurrentRoute(route: string): boolean {
    return this.route.snapshot.url.some((u) => route.includes(u.path));
  }
}
