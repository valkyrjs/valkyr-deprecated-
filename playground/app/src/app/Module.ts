import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ApplicationModule } from "./Application/Module";
import { AuthorizationModule } from "./Authorization/Module";
import { AppComponent } from "./Component";
import { routes } from "./Routing";
import { WorkspaceModule } from "./Workspace/Module";

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes), ApplicationModule, AuthorizationModule, WorkspaceModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppModule {}
