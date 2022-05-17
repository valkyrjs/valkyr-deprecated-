import { Component } from "@angular/core";
import { IdentityService } from "@valkyr/identity";

@Component({
  selector: "vlk-identity-create",
  templateUrl: "Template.html",
  styleUrls: ["./Styles.scss"]
})
export class CreateIdentityComponent {
  alias = "";
  password = "";

  constructor(readonly service: IdentityService) {}

  async create() {
    const secretKey = await this.service.create(this.alias, this.password);
    console.log(secretKey);
  }
}
