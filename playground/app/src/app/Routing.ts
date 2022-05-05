import { Routes } from "@angular/router";
import { AuthGuard, GuestGuard } from "@valkyr/angular";

import { ApplicationComponent } from "./Application/Component";
import { AuthorizationComponent } from "./Authorization/Component";
import { DashboardComponent } from "./Workspace/Components/Dashboard/Component";
import { LandingComponent } from "./Workspace/Components/Landing/Component";

export const routes: Routes = [
  { path: "", redirectTo: "/workspaces", pathMatch: "full" },
  {
    path: "authorize",
    component: AuthorizationComponent,
    canActivate: [GuestGuard]
  },
  {
    path: "workspaces",
    component: ApplicationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: LandingComponent },
      { path: ":id", component: DashboardComponent }
    ]
  }
];
