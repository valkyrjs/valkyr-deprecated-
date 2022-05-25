import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  AuthService,
  IdentityStorageService,
  PrivateIdentity,
  PrivateIdentityService,
  UserIdentityService
} from "@valkyr/angular";
import { AccessKey, generateSecretKey } from "@valkyr/security";

@Component({
  selector: "vlk-identity-registration",
  templateUrl: "Template.html",
  styleUrls: ["./Styles.scss"]
})
export class RegistrationComponent {
  step: Step = "create";

  provider = "";
  alias = "";
  password = "";
  secret = "";

  name = "";

  #access?: AccessKey;
  #identity?: PrivateIdentity;

  constructor(
    readonly router: Router,
    readonly privateIdentity: PrivateIdentityService,
    readonly userIdentity: UserIdentityService,
    readonly auth: AuthService,
    readonly storage: IdentityStorageService
  ) {}

  get access() {
    const access = this.#access;
    if (access === undefined) {
      throw new Error("Registration Violation: Could not create user, no access key available");
    }
    return access;
  }

  get identity() {
    const identity = this.#identity;
    if (identity === undefined) {
      throw new Error("Registration Violation: Could not create user, no identity available");
    }
    return identity;
  }

  get qrcode() {
    return this.access.value;
  }

  async create() {
    this.secret = generateSecretKey();
    this.#access = AccessKey.resolve(this.password, this.secret);
    this.#identity = await this.privateIdentity.create(this.alias);
    this.step = "confirm";
  }

  async confirm() {
    this.step = "user";
  }

  async user() {
    const user = await this.userIdentity.create(this.identity.id, { name: this.name });
    await this.storage.export(this.identity.id, this.access);
    this.auth.set(user.id);
    this.router.navigate(["/"]);
  }

  print() {
    window.print();
  }
}

type Step = "create" | "confirm" | "user";
