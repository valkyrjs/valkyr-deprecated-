import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GuestGuard } from "@valkyr/angular";

import { AuthorizationComponent } from "./Component";

const routes: Routes = [{ path: "authorize", component: AuthorizationComponent, canActivate: [GuestGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule {}
