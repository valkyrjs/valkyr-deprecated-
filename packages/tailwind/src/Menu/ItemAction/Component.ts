import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-item-action",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuItemActionComponent {
  public readonly type = "item";

  @Input("name") public name!: string;
  @Input("action") public action!: any;
  @Input("icon") public icon: string | undefined;
}
