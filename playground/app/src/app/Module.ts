import { DragDropModule } from "@angular/cdk/drag-drop";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AccessModule, LedgerModule, ModalModule } from "@valkyr/angular";
import { IdentityProviderService, IdentityService, localIdentityStorage } from "@valkyr/identity";
import { IdentityModule } from "@valkyr/tailwind";
import { from, Observable } from "rxjs";

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
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [IdentityService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {
  constructor(readonly client: IdentityService, readonly provider: IdentityProviderService) {
    console.log("Provider:", provider.id);
  }
}

function initializeAppFactory(identity: IdentityService): () => Observable<any> {
  return () => from(identity.init());
}
