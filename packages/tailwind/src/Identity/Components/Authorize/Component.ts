import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IdentityService } from "@valkyr/identity";

@Component({
  selector: "vlk-identity-authorize",
  templateUrl: "Template.html",
  styleUrls: ["./Styles.scss"]
})
export class AuthorizeComponent {
  provider = "";
  alias = "";
  peerId = "";

  constructor(readonly router: Router, readonly service: IdentityService) {
    this.peerId = service.id;
  }

  async authenticate() {
    try {
      await this.service.authorize(this.provider, this.alias);
      this.router.navigate(["/"]);
    } catch (err) {
      console.log(err);
    }
  }
}
