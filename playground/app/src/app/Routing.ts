import { Routes } from "@angular/router";
import { AuthGuard, GuestGuard } from "@valkyr/angular";

import { AuthorizationComponent } from "./Authorization";
import { DesignSystemComponent } from "./DesignSystem";
import { DiscoveryComponent } from "./Discovery";
import { TextEditorComponent } from "./TextEditor";
import { TodoListComponent } from "./Todo/List/Component";
import { TodoPickerComponent } from "./Todo/Picker/Component";
import { WorkspaceItemComponent, WorkspaceListComponent } from "./Workspace";
import { WorkspaceComponent } from "./Workspace/Component";

export const routes: Routes = [
  { path: "", redirectTo: "/workspaces", pathMatch: "full" },
  {
    path: "authorize",
    component: AuthorizationComponent,
    canActivate: [GuestGuard]
  },
  {
    path: "workspaces",
    component: DiscoveryComponent,
    canActivate: [AuthGuard],
    children: [{ path: "", component: WorkspaceListComponent }]
  },
  {
    path: "workspaces/:workspace",
    component: WorkspaceComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: WorkspaceItemComponent },
      { path: "todos", component: TodoPickerComponent },
      { path: "todos/:todo", component: TodoListComponent }
    ]
  },
  {
    path: "editor",
    component: DiscoveryComponent,
    children: [{ path: "", component: TextEditorComponent }]
  },
  {
    path: "ui",
    component: DiscoveryComponent,
    children: [{ path: "", component: DesignSystemComponent }]
  }
];
