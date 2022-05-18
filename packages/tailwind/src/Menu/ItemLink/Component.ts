import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-item-link",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuItemLinkComponent {
  public readonly type = "item";

  @Input("name") public name!: string;
  @Input("icon") public icon: string | undefined;
  @Input("link") public link!: string;
}
