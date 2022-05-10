import { Component } from "@angular/core";
import { TitleService } from "@valkyr/angular";

@Component({
  selector: "app-title",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TitleComponent {
  public title = "";

  constructor(service: TitleService) {
    service.subscribe((title) => {
      if (title.targets.has("application")) {
        this.title = title.value;
      }
    });
  }
}
