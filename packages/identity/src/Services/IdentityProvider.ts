import { Provider } from "@angular/core";
import { getAlphaUppercase } from "@valkyr/security";
import { Peer, PeerJSOption } from "peerjs";

export class IdentityProviderService {
  #peer: Peer;

  constructor(options: PeerJSOption) {
    this.#peer = new Peer(getAlphaUppercase(6), options).on("connection", (dataConnection) => {
      console.log("Incoming connection", dataConnection);
    });
  }

  // ### Factory

  static for(options: PeerJSOption): Provider {
    return {
      provide: IdentityProviderService,
      useFactory: () => new IdentityProviderService(options)
    };
  }
}
