import { Component, Input } from "@angular/core";

import { MenuItem } from "../../Models/MenuItem";

@Component({
  selector: "app-menu-list",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuListComponent {
  public readonly type = "category";
  activeItem?: string;

  @Input("items") public items!: MenuItem[];

  isActive(item: MenuItem): boolean {
    return item.href === this.activeItem;
  }
}
