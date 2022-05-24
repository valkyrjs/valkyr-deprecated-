import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  IdentityProviderService,
  IdentityProviderStore,
  IdentityService,
  IdentityServiceOptions
} from "@valkyr/identity";
import { QrCodeModule } from "ng-qrcode";

import { AuthorizeComponent } from "./Components/Authorize/Component";
import { RegistrationComponent } from "./Components/Registration/Component";
import { ShellComponent } from "./Components/Shell/Component";
import { routes } from "./Routes";

@NgModule({
  imports: [CommonModule, FormsModule, QrCodeModule, RouterModule.forRoot(routes)],
  declarations: [ShellComponent, RegistrationComponent, AuthorizeComponent],
  exports: [RouterModule]
})
export class IdentityModule {
  static forRoot(options: IdentityServiceOptions, store: IdentityProviderStore): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [IdentityService.for(options), IdentityProviderService.for(options, store)]
    };
  }
}
