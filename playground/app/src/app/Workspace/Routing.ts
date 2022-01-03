import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@valkyr/angular";

import { DashboardComponent } from "./Components/Dashboard/Component";
import { LandingComponent } from "./Components/Landing/Component";
import { ShellComponent } from "./Shell/Component";

const routes: Routes = [
  {
    path: "workspaces",
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: LandingComponent },
      { path: ":id", component: DashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
