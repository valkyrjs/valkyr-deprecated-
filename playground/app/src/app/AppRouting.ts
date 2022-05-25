import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IdentityGuard } from "@valkyr/tailwind";

const routes: Routes = [
  { path: "", redirectTo: "/workspaces", pathMatch: "full" },
  {
    path: "workspaces",
    canActivate: [IdentityGuard],
    loadChildren: () => import("./Modules/Workspace").then((m) => m.WorkspaceModule)
  },
  {
    path: "boards",
    canActivate: [IdentityGuard],
    loadChildren: () => import("./Modules/Todo").then((m) => m.TodoModule)
  },
  {
    path: "editor",
    loadChildren: () => import("./Modules/TextEditor").then((m) => m.TextEditorModule)
  },
  {
    path: "ui",
    canActivate: [],
    loadChildren: () => import("./Modules/DesignSystem").then((m) => m.DesignSystemModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
