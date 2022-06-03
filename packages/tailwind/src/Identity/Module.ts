import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { QrCodeModule } from "ng-qrcode";

import { ButtonModule } from "../Button";
import { BasicStrategyComponent } from "./Basic/Component";
import { RegistrationComponent } from "./Registration/Component";
import { routes } from "./Routes";
import { ShellComponent } from "./Shell/Component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, FormsModule, QrCodeModule, RouterModule.forRoot(routes)],
  declarations: [ShellComponent, RegistrationComponent, BasicStrategyComponent],
  exports: [RouterModule]
})
export class TailwindIdentityModule {}
