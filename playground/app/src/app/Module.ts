import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AccessModule, LedgerModule, ModalModule } from "@valkyr/angular";
import { IdentityProviderService, localIdentityStorage } from "@valkyr/identity";
import { IdentityModule } from "@valkyr/tailwind";

import { AuthorizationModule } from "./Authorization";
import { AppComponent } from "./Component";
import { DesignSystemModule } from "./DesignSystem/Module";
import { DiscoveryModule } from "./Discovery";
import { routes } from "./Routing";
import { TemplateModule } from "./Templates/Module";
import { TodoModule } from "./Todo";
import { WorkspaceModule } from "./Workspace";

@NgModule({
  imports: [
    AccessModule,
    AuthorizationModule,
    BrowserModule,
    DragDropModule,
    DiscoveryModule,
    TemplateModule,
    DesignSystemModule,
    IdentityModule.forRoot(
      {
        host: "188.166.248.32",
        port: 9000,
        path: "/myapp"
      },
      localIdentityStorage
    ),
    LedgerModule,
    ModalModule,
    RouterModule.forRoot(routes),
    TodoModule,
    WorkspaceModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {
  constructor(readonly provider: IdentityProviderService) {
    console.log("Provider:", provider.id);
  }
}
