import { Component } from "@angular/core";

import { TitleService } from "../Services/TitleService";

@Component({
  selector: "app-title",
  templateUrl: "./Template.html"
})
export class TitleComponent {
  public title = "";

  constructor(service: TitleService) {
    service.subscribe((title) => {
      console.log("Set Title", title);
      this.title = title;
    });
  }
}
