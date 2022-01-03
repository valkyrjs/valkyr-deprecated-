import { Component } from "@angular/core";
import { AuthService } from "@valkyr/angular";

import { Step, WizardService } from "../Services/Wizard";

@Component({
  selector: "authorization-email",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class EmailComponent {
  public email = "";

  constructor(private auth: AuthService, private wizard: WizardService) {}

  public submit() {
    if (!this.email) {
      throw new Error("Invalid email");
    }
    this.auth.create(this.email);
    this.wizard.navigate(Step.Token, this.email);
  }
}
