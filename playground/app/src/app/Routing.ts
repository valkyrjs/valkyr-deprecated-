import { Routes } from "@angular/router";
import { AuthGuard, GuestGuard } from "@valkyr/angular";

import { ApplicationComponent } from "./Application";
import { AuthorizationComponent } from "./Authorization";
import { TextEditorComponent } from "./TextEditor";
import { DashboardComponent, LandingComponent } from "./Workspace";

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
  },
  {
    path: "editor",
    component: ApplicationComponent,
    children: [{ path: "", component: TextEditorComponent }]
  }
];
