import { Provider } from "@angular/core";
import { JsonRpcServer } from "@valkyr/network";
import { getAlphaUppercase } from "@valkyr/security";

import { IdentityData, IdentityProviderStore } from "../IdentityStorage";
import { IdentityServiceOptions } from "./Types";

export class IdentityProviderService extends JsonRpcServer {
  constructor(options: IdentityServiceOptions, readonly store: IdentityProviderStore) {
    super(options.id ?? getAlphaUppercase(6), options);
    this.#registerMethods();
  }

  // ### Factory

  static for(options: IdentityServiceOptions, store: IdentityProviderStore): Provider {
    return {
      provide: IdentityProviderService,
      useFactory: () => new IdentityProviderService(options, store)
    };
  }

  // ### Internal Utilities

  #registerMethods() {
    this.method("authorize", this.#authorize.bind(this));
    this.method("persist", this.#persist.bind(this));
  }

  async #authorize([alias]: [string], peer: string) {
    if (confirm(`"${peer}" wants to authorize "${alias}" alias`)) {
      const data = await this.store.get(alias);
      if (data) {
        return {
          status: "FOUND",
          data
        };
      }
      return {
        status: "NOT_FOUND"
      };
    }
    return {
      status: "REJECTED"
    };
  }

  async #persist([alias, identity]: [string, IdentityData]) {
    return this.store.set(alias, identity);
  }
}
