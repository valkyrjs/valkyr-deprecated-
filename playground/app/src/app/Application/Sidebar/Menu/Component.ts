import { Component, Input } from "@angular/core";
import { Menu } from "@valkyr/angular";

@Component({
  selector: "sb-menu",
  templateUrl: "./Template.html"
})
export class MenuComponent {
  @Input("menu") public menu!: Menu;
}
