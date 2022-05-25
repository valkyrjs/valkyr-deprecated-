import { DragDropModule } from "@angular/cdk/drag-drop";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AccessModule, LedgerModule, ModalModule } from "@valkyr/angular";
import { IdentityProviderService, IdentityService, localIdentityStorage } from "@valkyr/identity";
import { ButtonModule, IdentityModule } from "@valkyr/tailwind";
import { from, Observable } from "rxjs";

import { AppRoutingModule } from "./AppRouting";
import { AppComponent } from "./Component";
import { LayoutModule } from "./Library/Layout/Module";
import { TaskServicesModule } from "./Library/TaskServices";
import { ThemeModule } from "./Library/ThemeService";
import { WorkspaceServicesModule } from "./Library/WorkspaceServices";

@NgModule({
  imports: [
    AccessModule,
    BrowserModule,
    ButtonModule,
    BrowserAnimationsModule,
    LayoutModule,
    DragDropModule,
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
    ThemeModule,
    TaskServicesModule,
    WorkspaceServicesModule,
    RouterModule.forRoot([]),
    AppRoutingModule
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
