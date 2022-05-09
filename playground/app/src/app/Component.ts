import { Component } from "@angular/core";
import { MenuService, StreamContainerService } from "@valkyr/angular";

@Component({
  selector: "app-root",
  templateUrl: "./Template.html"
})
export class AppComponent {
  constructor(menu: MenuService, stream: StreamContainerService) {
    menu.init();
    stream.init();
  }
}
