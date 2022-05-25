import { Component, Input } from "@angular/core";

@Component({
  selector: "app-navbar-link",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class NavbarLinkComponent {
  @Input("name") public name!: string;
  @Input("link") public link!: string;
  @Input("isActive") public isActive!: boolean;
}
