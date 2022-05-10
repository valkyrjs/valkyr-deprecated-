import { Component, OnInit } from "@angular/core";
import { AuthService } from "@valkyr/angular";

import { ThemeService } from "../../Services/ThemeService";

@Component({
  selector: "navbar-profile",
  templateUrl: "./Template.html"
})
export class NavbarProfileComponent implements OnInit {
  isLight: boolean;

  constructor(readonly auth: AuthService, readonly theme: ThemeService) {
    this.isLight = theme.currentTheme === "light";
  }

  ngOnInit(): void {
    this.isLight = this.theme.currentTheme === "light";
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
    this.isLight = this.theme.currentTheme === "light";
  }
}
