import { Component, Input } from "@angular/core";
import { TitleService } from "@valkyr/angular";

@Component({
  selector: "title",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TitleComponent {
  @Input("area") area = "";

  title = "";

  constructor(title: TitleService) {
    title.subscribe((title) => {
      if (title.targets.has(this.area)) {
        this.title = title.value;
      }
    });
  }
}
