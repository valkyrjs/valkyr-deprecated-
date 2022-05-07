import { Component } from "@angular/core";
import { TitleService } from "@valkyr/angular";

@Component({
  selector: "app-title",
  templateUrl: "./Template.html"
})
export class TitleComponent {
  public title = "";

  constructor(service: TitleService) {
    service.subscribe(([title, target]) => {
      if (target === "application") {
        this.title = title;
      }
    });
  }
}
