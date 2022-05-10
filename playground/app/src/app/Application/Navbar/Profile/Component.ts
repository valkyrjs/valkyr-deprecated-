import { Component, Injector, OnInit } from "@angular/core";
import { AuthService, DataSubscriber } from "@valkyr/angular";

import { ThemeService } from "../../Services/ThemeService";

@Component({
  selector: "navbar-profile",
  templateUrl: "./Template.html"
})
export class NavbarProfileComponent extends DataSubscriber implements OnInit {
  public isLight: boolean;

  constructor(private auth: AuthService, private theme: ThemeService, injector: Injector) {
    super(injector);
    this.isLight = theme.currentTheme === "light";
  }

  public ngOnInit(): void {
    this.isLight = this.theme.currentTheme === "light";
  }

  public toggleTheme(): void {
    this.theme.toggleTheme();
    this.isLight = this.theme.currentTheme === "light";
  }
}
