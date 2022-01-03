import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";

import { AuthorizationModule } from "./Authorization/Module";
import { AppComponent } from "./Component";
import { WorkspaceModule } from "./Workspace/Module";

const routes: Routes = [{ path: "", redirectTo: "/workspaces", pathMatch: "full" }];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes), AuthorizationModule, WorkspaceModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
