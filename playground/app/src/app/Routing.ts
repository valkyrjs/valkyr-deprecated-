import { Routes } from "@angular/router";
import { IdentityGuard } from "@valkyr/tailwind";

import { DesignSystemComponent } from "./DesignSystem";
import { DiscoveryComponent } from "./Discovery";
import { TemplateListComponent } from "./Templates";
import { TextEditorComponent } from "./TextEditor";
import { TodoListComponent } from "./Todo/List/Component";
import { TodoPickerComponent } from "./Todo/Picker/Component";
import { WorkspaceItemComponent, WorkspaceListComponent } from "./Workspace";
import { WorkspaceComponent } from "./Workspace/Component";

export const routes: Routes = [
  { path: "", redirectTo: "/workspaces", pathMatch: "full" },
  {
    path: "workspaces",
    component: DiscoveryComponent,
    canActivate: [IdentityGuard],
    children: [{ path: "", component: WorkspaceListComponent }]
  },
  {
    path: "workspaces/:workspace",
    component: WorkspaceComponent,
    canActivate: [IdentityGuard],
    children: [
      { path: "", component: WorkspaceItemComponent },
      { path: "todos", component: TodoPickerComponent },
      { path: "todos/:todo", component: TodoListComponent }
    ]
  },
  {
    path: "workspaces/:workspace/templates",
    component: TemplateListComponent,
    canActivate: [AuthGuard]
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
