import { Component, Input } from "@angular/core";

@Component({
  selector: "app-menu-item-action-link",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuItemActionLinkComponent {
  public readonly type = "item";

  @Input("name") public name!: string;
  @Input("action") public action?: any;
  @Input("icon") public icon: string | undefined;
}
