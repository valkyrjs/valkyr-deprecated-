import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { IdentityProviderService, IdentityService } from "@valkyr/identity";
import { PeerJSOption } from "peerjs";

import { ConfirmIdentityComponent } from "./Components/ConfirmIdentity/Component";
import { CreateIdentityComponent } from "./Components/CreateIdentity/Component";
import { routes } from "./Routes";

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  declarations: [CreateIdentityComponent, ConfirmIdentityComponent],
  exports: [RouterModule]
})
export class IdentityModule {
  static forRoot(options: PeerJSOption): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [IdentityService.for(options), IdentityProviderService.for(options)]
    };
  }
}
