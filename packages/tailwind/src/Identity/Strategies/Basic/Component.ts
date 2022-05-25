import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, IdentityStorageService, UserIdentity, UserIdentityService } from "@valkyr/angular";
import { AccessKey } from "@valkyr/security";

@Component({
  selector: "vlk-identity-strategy-basic",
  templateUrl: "Template.html",
  styleUrls: ["./Styles.scss"]
})
export class BasicStrategyComponent {
  step: Step = "authenticate";

  alias = "";
  password = "";
  secret = "";

  users: UserIdentity[] = [];

  remember = false;

  constructor(
    readonly router: Router,
    readonly storage: IdentityStorageService,
    readonly userIdentity: UserIdentityService,
    readonly auth: AuthService
  ) {}

  async authenticate() {
    const { users } = await this.storage.import(this.alias, AccessKey.resolve(this.password, this.secret));
    this.users = users;
    this.step = "users";
  }

  async select(id: string) {
    await this.auth.set(id);
    this.router.navigate(["/"]);
  }
}

type Step = "authenticate" | "users";
