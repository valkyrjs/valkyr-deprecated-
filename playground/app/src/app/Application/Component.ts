import { Component, OnInit } from "@angular/core";

import { applyTheme } from "./Services/ThemeService";

@Component({
  selector: "app-template",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ApplicationComponent implements OnInit {
  public ngOnInit(): void {
    applyTheme("light");
  }
}
