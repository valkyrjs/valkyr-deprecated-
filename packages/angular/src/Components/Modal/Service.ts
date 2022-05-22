import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import { Injectable, InjectionToken, Injector } from "@angular/core";

import { SubscriberService } from "../../Helpers/SubscriberService";

export const MODAL_CONTEXT_TOKEN = new InjectionToken<Record<string, unknown>>("modal:context");

@Injectable({
  providedIn: "root"
})
export class ModalService<T = any> extends SubscriberService<ComponentPortal<T> | undefined> {
  public open(component: ComponentType<T>, context: any = {}) {
    this.observer.next(
      new ComponentPortal(
        component,
        null,
        Injector.create({
          providers: [
            {
              provide: MODAL_CONTEXT_TOKEN,
              useValue: context
            }
          ]
        })
      )
    );
  }

  public close() {
    this.observer.next(undefined);
  }
}
