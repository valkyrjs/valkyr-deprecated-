import { Component, Input } from "@angular/core";

import { Menu } from "./Models";

@Component({
  selector: "menu",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuComponent {
  @Input("menu") menu!: Menu;
}
