import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  #access?: AccessKey;
  #identity?: PrivateIdentity;

  registerForm = new FormGroup({
    alias: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  confirmForm = new FormGroup({
    alias: new FormControl({ value: "", disabled: true }, Validators.required),
    password: new FormControl({ value: "", disabled: true }, Validators.required),
    secret: new FormControl({ value: "", disabled: true }, Validators.required)
  });

  userForm = new FormGroup({
    name: new FormControl("", Validators.required)
  });

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
    const secret = generateSecretKey();

    if (!this.registerForm.value.password) {
      throw new Error("No password present");
    }

    if (!this.registerForm.value.alias) {
      throw new Error("No alias present");
    }

    this.#access = AccessKey.resolve(this.registerForm.value.password, secret);
    this.#identity = await this.privateIdentity.create(this.registerForm.value.alias);

    this.auth.setIdentity(this.#identity.id);
    this.auth.setAccess(this.#access);

    this.confirmForm.setValue({
      secret,
      alias: this.registerForm.value.alias,
      password: this.registerForm.value.password
    });
    this.step = "confirm";
  }

  async confirm() {
    this.step = "user";
  }

  async createUser() {
    if (!this.userForm.value.name) {
      throw new Error("No name present");
    }
    const user = await this.userIdentity.create(this.identity.id, { name: this.userForm.value.name });
    await this.storage.export(this.identity.id, this.access);
    this.auth.setUser(user.id);
    this.router.navigate(["/"]);
  }

  print() {
    window.print();
  }
}

type Step = "create" | "confirm" | "user";
