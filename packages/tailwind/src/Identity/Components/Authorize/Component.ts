import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IdentityService, UserIdentity } from "@valkyr/identity";

@Component({
  selector: "vlk-identity-authorize",
  templateUrl: "Template.html",
  styleUrls: ["./Styles.scss"]
})
export class AuthorizeComponent {
  step: Step = "authenticate";

  provider = "";
  alias = "";
  peerId = "";

  users: UserIdentity[] = [];

  remember = false;

  constructor(readonly router: Router, readonly service: IdentityService) {
    this.peerId = service.id;
  }

  async authenticate() {
    await this.service.authorize(this.provider, this.alias);
    await this.service.persistToDevice(this.remember);
    this.users = this.service.identity.users;
    this.step = "users";
  }

  async select(cid: string) {
    const user = this.service.identity.users.find((user) => user.cid === cid);
    if (user === undefined) {
      throw new Error("Authorization Violation: User could not be resolved");
    }
    this.service.setSelectedUser(cid);
    this.router.navigate(["/"]);
  }
}

type Step = "authenticate" | "users";
