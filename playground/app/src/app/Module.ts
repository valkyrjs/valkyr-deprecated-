import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ModalModule } from "@valkyr/angular";

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
    ModalModule,
    TodoModule,
    WorkspaceModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
