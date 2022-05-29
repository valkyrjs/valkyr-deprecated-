import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Database } from "../Database";
import { Event, EventDocument } from "./Models/Event";
import { EventTracker, EventTrackerDocument } from "./Models/EventTracker";

@NgModule({
  providers: [
    Database.for([
      {
        model: Event,
        collection: new Collection<EventDocument>("events", new IndexedDbAdapter())
      },
      {
        model: EventTracker,
        collection: new Collection<EventTrackerDocument>("events_tracker", new IndexedDbAdapter())
      }
    ])
  ]
})
export class LedgerModule {
  static forRoot({ projectors = [], validators = [] }: LedgerSettings): ModuleWithProviders<LedgerModule> {
    return {
      ngModule: LedgerModule,
      providers: [
        ...projectors.map((entry) => ({
          provide: APP_INITIALIZER,
          useFactory:
            (...deps: any[]) =>
            () =>
              new entry.projector(...deps),
          multi: true,
          deps: entry.deps
        })),
        ...validators.map((entry) => ({
          provide: APP_INITIALIZER,
          useFactory:
            (...deps: any[]) =>
            () =>
              new entry.validator(...deps),
          multi: true,
          deps: entry.deps
        }))
      ]
    };
  }
}

type LedgerSettings = {
  projectors?: Projectors;
  validators?: Validators;
};

type Projectors = {
  projector: new (...deps: any[]) => any;
  deps?: any[];
}[];

type Validators = {
  validator: new (...deps: any[]) => any;
  deps?: any[];
}[];
