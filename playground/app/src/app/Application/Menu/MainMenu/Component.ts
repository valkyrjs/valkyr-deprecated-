import { Component, Input } from "@angular/core";
import { Menu } from "@valkyr/angular";

@Component({
  selector: "menu-main",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MainMenuComponent {
  @Input("menu") public menu!: Menu;
}
