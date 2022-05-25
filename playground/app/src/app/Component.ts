import { Component, OnInit } from "@angular/core";

import { ThemeService } from "./Shared/ThemeService/ThemeService";

@Component({
  selector: "app-root",
  templateUrl: "./Template.html"
})
export class AppComponent implements OnInit {
  constructor(readonly theme: ThemeService) {}

  ngOnInit(): void {
    const current = this.theme.currentTheme;
    this.theme.applyTheme(current);
  }
}
