import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ThemeService } from "./ThemeService";

@NgModule({
  imports: [CommonModule],
  providers: [ThemeService]
})
export class ThemeModule {}
