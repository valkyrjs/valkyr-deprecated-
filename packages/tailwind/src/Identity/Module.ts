import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { QrCodeModule } from "ng-qrcode";

import { RegistrationComponent } from "./Components/Registration/Component";
import { ShellComponent } from "./Components/Shell/Component";
import { routes } from "./Routes";
import { BasicStrategyComponent } from "./Strategies/Basic/Component";

@NgModule({
  imports: [CommonModule, FormsModule, QrCodeModule, RouterModule.forRoot(routes)],
  declarations: [ShellComponent, RegistrationComponent, BasicStrategyComponent],
  exports: [RouterModule]
})
export class TailwindIdentityModule {}
