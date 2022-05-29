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
    const access = AccessKey.resolve(this.password, this.secret);
    const { identity, users } = await this.storage.import(this.alias, access);

    this.auth.setIdentity(identity.id);
    this.auth.setAccess(access);

    this.users = users;
    this.step = "users";
  }

  async select(id: string) {
    this.auth.setUser(id);
    this.router.navigate(["/"]);
  }
}

type Step = "authenticate" | "users";
