import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-item",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuItemComponent {
  public readonly type = "item";

  @Input("name") public name!: string;
  @Input("link") public link!: string;
}