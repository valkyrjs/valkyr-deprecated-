import { Component, Input } from "@angular/core";
import { Menu } from "@valkyr/angular";

@Component({
  selector: "menu-secondary",
  templateUrl: "./Template.html"
})
export class SecondaryMenuComponent {
  @Input("menu") public menu!: Menu;
}
