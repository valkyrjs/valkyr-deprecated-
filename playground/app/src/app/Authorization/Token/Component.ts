import { Component } from "@angular/core";

import { Step, WizardService } from "../Services/Wizard";

@Component({
  selector: "authorization-token",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TokenComponent {
  public size = Array.from(Array(6));
  public inputs = new Map<number, string>([
    [0, ""],
    [1, ""],
    [2, ""],
    [3, ""],
    [4, ""],
    [5, ""]
  ]);

  constructor(private wizard: WizardService) {}

  public get isComplete() {
    return this.token.length === 6;
  }

  public get token() {
    return this.values.join("");
  }

  public get values() {
    return Array.from(this.inputs.values());
  }

  public get email() {
    return this.wizard.email;
  }

  public onChange(index: number, event: any) {
    const value = event.target.value;
    if (value) {
      this.inputs.set(index, value);
      const nextInput = document.getElementById(`token-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.select();
      } else {
        event.target.select();
      }
    }
    if (this.isComplete) {
      this.wizard.navigate(Step.Submit, this.token);
    }
  }

  public onFocus(event: any) {
    event.target.select();
  }

  public onDelete(index: number, event: any) {
    const inputValue = event.target.value;
    const prevValue = this.inputs.get(index);
    if (prevValue !== "") {
      this.inputs.set(index, "");
    }
    if (inputValue === "") {
      const prevInput = document.getElementById(`token-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.select();
      }
    }
  }
}
