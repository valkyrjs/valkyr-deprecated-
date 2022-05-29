import { PortalModule } from "@angular/cdk/portal";
import { NgModule } from "@angular/core";

import {
  ModalComponent,
  ModalContainerComponent,
  ModalContentComponent,
  ModalFooterComponent,
  ModalHeaderComponent
} from "./Component";

@NgModule({
  declarations: [
    ModalComponent,
    ModalContainerComponent,
    ModalHeaderComponent,
    ModalContentComponent,
    ModalFooterComponent
  ],
  imports: [PortalModule],
  exports: [ModalComponent, ModalContainerComponent, ModalHeaderComponent, ModalContentComponent, ModalFooterComponent]
})
export class ModalModule {}
