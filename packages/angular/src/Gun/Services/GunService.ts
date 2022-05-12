// eslint-disable-next-line simple-import-sort/imports
import { Provider } from "@angular/core";
import GUN, { IGunInstance } from "gun";

import "gun/sea";
import "gun/lib/then";

export type EventRecord = {
  alias: string;
  event: string;
};

export class GunService {
  constructor(readonly gun: IGunInstance) {}

  static for(peers: string[]): Provider {
    return {
      provide: GunService,
      useFactory: () => new GunService(GUN({ peers }))
    };
  }

  get user() {
    return this.gun.user.bind(this.gun);
  }

  get put() {
    return this.gun.put.bind(this.gun);
  }

  get get() {
    return this.gun.get.bind(this.gun);
  }

  get opt() {
    return this.gun.opt.bind(this.gun);
  }

  get on() {
    return this.gun.on.bind(this.gun);
  }
}
