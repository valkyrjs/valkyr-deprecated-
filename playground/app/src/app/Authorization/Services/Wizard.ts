import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@valkyr/angular";
import { Subject } from "rxjs";

export enum Step {
  Email,
  Token,
  Submit
}

@Injectable()
export class WizardService {
  public email = "";

  private observer = new Subject<Step>();
  private subscriber = this.observer.asObservable();

  constructor(private router: Router, private auth: AuthService) {}

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public navigate(step: Step, value: string) {
    if (step === Step.Token) {
      this.email = value;
      this.observer.next(step);
    }
    if (step === Step.Submit) {
      this.auth.sign(this.email, value).then(() => {
        this.router.navigate(["/"]);
      });
    }
  }
}
