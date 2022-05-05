import { Component, Input } from "@angular/core";

@Component({
  selector: "sb-menu-item",
  templateUrl: "./Template.html"
})
export class MenuItemComponent {
  public readonly type = "item";

  @Input("name") public name!: string;
  @Input("href") public href!: string;
}
