import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "../../Auth";

@Injectable({ providedIn: "root" })
export class IdentityGuard implements CanActivate {
  constructor(readonly router: Router, readonly auth: AuthService) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(["/identity/authorize"], {
        queryParams: {
          returnUrl: state.url
        }
      });
      return false;
    }
    return true;
  }
}