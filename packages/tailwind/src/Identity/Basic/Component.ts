import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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

  signinForm = new FormGroup({
    alias: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    secret: new FormControl("", Validators.required),
    remember: new FormControl(false)
  });

  users: UserIdentity[] = [];

  remember = false;

  constructor(
    readonly router: Router,
    readonly storage: IdentityStorageService,
    readonly userIdentity: UserIdentityService,
    readonly auth: AuthService
  ) {}

  async authenticate() {
    console.log("hit");
    const access = AccessKey.resolve(this.signinForm.value.password, this.signinForm.value.secret);
    const { identity, users } = await this.storage.import(this.signinForm.value.alias, access);

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
