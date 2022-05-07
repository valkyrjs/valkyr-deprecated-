import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-item",
  templateUrl: "./Template.html"
})
export class MenuItemComponent {
  public readonly type = "item";

  @Input("name") public name!: string;
  @Input("href") public href!: string;
}
