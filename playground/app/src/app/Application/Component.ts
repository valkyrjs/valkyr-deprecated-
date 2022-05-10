import { Component, OnInit } from "@angular/core";

import { ThemeService } from "./Services/ThemeService";

@Component({
  selector: "app-template",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ApplicationComponent implements OnInit {
  constructor(private theme: ThemeService) {}

  public ngOnInit(): void {
    const current = this.theme.currentTheme;
    this.theme.applyTheme(current);
  }
}
