import { Component, Input } from "@angular/core";

import { MenuCategory } from "../../Models/MenuCategory";

@Component({
  selector: "app-menu-categories",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuCategoriesComponent {
  @Input("categories") categories!: MenuCategory[];
}
