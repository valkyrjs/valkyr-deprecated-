import { Component } from "@angular/core";
import { MenuService } from "@valkyr/angular";

@Component({
  selector: "app-root",
  templateUrl: "./Template.html"
})
export class AppComponent {
  constructor(menu: MenuService) {
    menu.init();
  }
}
