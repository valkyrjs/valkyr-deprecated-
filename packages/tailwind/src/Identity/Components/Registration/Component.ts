import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IdentityService } from "@valkyr/identity";

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

  constructor(readonly router: Router, readonly service: IdentityService) {}

  get qrcode() {
    return this.service.accessKey.value;
  }

  async create() {
    this.secret = await this.service.create(this.alias, this.password);
    this.step = "confirm";
  }

  async confirm() {
    this.step = "user";
  }

  async user() {
    const user = await this.service.identity.addUser({ name: this.name });
    await this.service.persistToProvider(this.provider);
    await this.service.persistToDevice(true);
    this.service.setSelectedUser(user.cid, true);
    this.router.navigate(["/"]);
  }

  print() {
    window.print();
  }
}

type Step = "create" | "confirm" | "user";
