import { Component, Input } from "@angular/core";

@Component({
  selector: "menu-list",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class MenuListComponent {
  public readonly type = "category";

  @Input("name") public name!: string;
}
