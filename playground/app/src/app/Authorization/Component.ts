import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { Step, WizardService } from "./Services/Wizard";

@Component({
  selector: "app-signin",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AuthorizationComponent implements OnInit {
  public readonly Step = Step;

  public step: Step = Step.Email;

  constructor(private wizard: WizardService) {}

  public ngOnInit(): void {
    this.wizard.subscribe((step) => {
      this.step = step;
    });
  }
}
