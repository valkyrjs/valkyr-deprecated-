import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { AuthGunService } from "../Services/AuthService";

@Injectable({
  providedIn: "root"
})
export class GunGuestGuard implements CanActivate {
  constructor(readonly router: Router, readonly auth: AuthGunService) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isAuthenticated) {
      this.router.navigate(["/"], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
}
