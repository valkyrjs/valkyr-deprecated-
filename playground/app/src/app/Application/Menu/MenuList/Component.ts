import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-list",
  templateUrl: "./Template.html"
})
export class MenuListComponent {
  public readonly type = "category";

  @Input("name") public name!: string;
}
