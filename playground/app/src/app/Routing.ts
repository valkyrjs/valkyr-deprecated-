import { Routes } from "@angular/router";
import { AuthGuard, GuestGuard } from "@valkyr/angular";

import { ApplicationComponent } from "./Application";
import { AuthorizationComponent } from "./Authorization";
import { getMenu } from "./Menu";
import { TextEditorComponent } from "./TextEditor";
import { TodoListComponent } from "./Todo/List/Component";
import { TodoPickerComponent } from "./Todo/Picker/Component";
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
      { path: "", component: LandingComponent, data: { menu: getMenu("workspace.landing") } },
      { path: ":id", component: DashboardComponent, data: { menu: getMenu("workspace.dashboard") } },
      {
        path: ":workspace/todos",
        children: [
          { path: "", component: TodoPickerComponent },
          { path: ":id", component: TodoListComponent }
        ]
      }
    ]
  },
  {
    path: "editor",
    component: ApplicationComponent,
    children: [{ path: "", component: TextEditorComponent, data: { menu: getMenu("sandbox") } }]
  }
];
