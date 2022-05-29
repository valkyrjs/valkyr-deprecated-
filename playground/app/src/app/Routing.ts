import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IdentityGuard } from "@valkyr/angular";

const routes: Routes = [
  { path: "", redirectTo: "/workspaces", pathMatch: "full" },
  {
    path: "workspaces",
    canActivate: [IdentityGuard],
    loadChildren: () => import("./Views/Workspaces").then((m) => m.WorkspacesModule)
  },
  {
    path: "boards",
    canActivate: [IdentityGuard],
    loadChildren: () => import("./Views/Tasks").then((m) => m.TasksModule)
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
