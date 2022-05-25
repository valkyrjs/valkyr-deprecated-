import { Component, Input } from "@angular/core";

import { MenuItem } from "../../Models/MenuItem";

@Component({
  selector: "app-header",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class HeaderComponent {
  @Input("menu") menu?: MenuItem[];
}
