import { Component, Input } from "@angular/core";

@Component({
  selector: "title",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TitleComponent {
  @Input("title") title?: string;
}
