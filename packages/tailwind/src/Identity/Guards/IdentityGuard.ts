import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { IdentityService } from "@valkyr/identity";

@Injectable({ providedIn: "root" })
export class IdentityGuard implements CanActivate {
  constructor(readonly router: Router, readonly identity: IdentityService) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.identity.isAuthenticated) {
      this.router.navigate(["/authorize"], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
}
