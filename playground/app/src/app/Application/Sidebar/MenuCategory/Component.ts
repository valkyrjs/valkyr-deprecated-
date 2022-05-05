import { Component, Input } from "@angular/core";

@Component({
  selector: "sb-menu-category",
  templateUrl: "./Template.html"
})
export class MenuCategoryComponent {
  public readonly type = "category";

  @Input("name") public name!: string;
}
