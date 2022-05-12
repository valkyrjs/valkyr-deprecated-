import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthGunService } from "@valkyr/angular";
import { GunAccountService } from "@valkyr/angular/src/Gun/Services/AccountService";

@Component({
  selector: "app-signin",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent {
  alias = "";
  password = "";

  constructor(readonly auth: AuthGunService, readonly router: Router, account: GunAccountService) {
    account.accounts().then(console.log);
  }

  submit() {
    this.auth
      .authenticate(this.alias, this.password)
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch((message: string) => {
        alert(message);
      });
  }

  register() {
    this.auth
      .create(this.alias, this.password)
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch((message: string) => {
        alert(message);
      });
  }
}
