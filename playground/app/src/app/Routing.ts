import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IdentityGuard } from "@valkyr/angular";

import { WorkspaceGuard } from "./Shared/WorkspaceServices";

const routes: Routes = [
  {
    path: "workspaces",
    canActivate: [IdentityGuard],
    loadChildren: () => import("./Views/Workspaces").then((m) => m.WorkspacesModule)
  },
  {
    path: "",
    canActivate: [IdentityGuard, WorkspaceGuard],
    loadChildren: () => import("./Views/Workspace").then((m) => m.WorkspaceModule)
  },
  {
    path: "boards",
    canActivate: [IdentityGuard],
    loadChildren: () => import("./Views/Items").then((m) => m.ItemsModule)
  },
  {
    path: "editor",
    loadChildren: () => import("./Views/TextEditor").then((m) => m.TextEditorModule)
  },
  {
    path: "ui",
    canActivate: [],
    loadChildren: () => import("./Views/DesignSystem").then((m) => m.DesignSystemModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
