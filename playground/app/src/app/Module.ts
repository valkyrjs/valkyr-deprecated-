import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { ApplicationModule } from "./Application";
import { AuthorizationModule } from "./Authorization";
import { AppComponent } from "./Component";
import { routes } from "./Routing";
import { TodoModule } from "./Todo";
import { WorkspaceModule } from "./Workspace";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ApplicationModule,
    AuthorizationModule,
    TodoModule,
    WorkspaceModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppModule {}
