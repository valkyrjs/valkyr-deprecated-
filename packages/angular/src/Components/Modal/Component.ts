import { Portal } from "@angular/cdk/portal";
import { Component } from "@angular/core";

import { ModalService } from "./Service";

@Component({
  selector: "vlk-modal",
  template: `<ng-template [cdkPortalOutlet]="selected"></ng-template>`,
  styleUrls: ["./Styles.scss"]
})
export class ModalComponent {
  public selected?: Portal<any>;

  constructor(modal: ModalService) {
    modal.subscribe((selected) => {
      this.selected = selected;
    });
  }
}

@Component({
  selector: "vlk-modal-container",
  template: `
    <div class="vlk-modal-overlay" (click)="close()"></div>
    <div class="vlk-modal-dialog">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        pointer-events: auto;
      }
    `
  ]
})
export class ModalContainerComponent {
  constructor(private modal: ModalService) {}

  public close() {
    this.modal.close();
  }
}

@Component({
  selector: "vlk-modal-header",
  template: `
    <div class="vlk-modal-header">
      <ng-content></ng-content>
    </div>
  `
})
export class ModalHeaderComponent {}

@Component({
  selector: "vlk-modal-content",
  template: `
    <div class="vlk-modal-content">
      <ng-content></ng-content>
    </div>
  `
})
export class ModalContentComponent {}

@Component({
  selector: "vlk-modal-footer",
  template: `
    <div class="vlk-modal-footer">
      <ng-content></ng-content>
    </div>
  `
})
export class ModalFooterComponent {}
