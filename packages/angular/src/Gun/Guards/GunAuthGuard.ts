import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { AuthGunService } from "../Services/AuthService";

@Injectable({
  providedIn: "root"
})
export class GunAuthGuard implements CanActivate {
  constructor(readonly router: Router, readonly auth: AuthGunService) {}

  async canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(["/authorize"], { queryParams: { returnUrl: state.url } });
      return false;
    }
    await this.auth.resolve();
    return true;
  }
}
