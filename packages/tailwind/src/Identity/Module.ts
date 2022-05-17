import { ModuleWithProviders, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IdentityProviderService, IdentityService } from "@valkyr/identity";
import { PeerJSOption } from "peerjs";

@NgModule({
  imports: [BrowserModule]
})
export class IdentityModule {
  static forRoot(options: PeerJSOption): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [IdentityService.for(options), IdentityProviderService.for(options)]
    };
  }
}
