import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-category",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuCategoryComponent {
  public readonly type = "category";

  @Input("name") public name!: string;
  @Input("showLabel") public showLabel!: boolean;
}
