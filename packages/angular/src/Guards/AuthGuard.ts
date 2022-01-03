import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "../Services/Auth/AuthService";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  public canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated) {
      this.router.navigate(["/authorize"], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
}
