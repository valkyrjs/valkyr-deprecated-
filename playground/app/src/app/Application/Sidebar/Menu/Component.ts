import { Component, Input } from "@angular/core";

import { Menu } from "../Menu";

@Component({
  selector: "sb-menu",
  templateUrl: "./Template.html"
})
export class MenuComponent {
  @Input("menu") public menu!: Menu;
}
