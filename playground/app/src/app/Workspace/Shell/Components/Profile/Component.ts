import { Component, Injector, OnInit } from "@angular/core";
import { AuthService, SubscriptionDirective } from "@valkyr/angular";

@Component({
  selector: "shell-profile",
  templateUrl: "./Template.html"
})
export class ProfileComponent extends SubscriptionDirective implements OnInit {
  constructor(private auth: AuthService, injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    // ...
  }
}
