import { Provider } from "@angular/core";
import { PrivateIdentity, UserIdentity } from "@valkyr/identity";
import { AccessKey, generateSecretKey, getAlphaUppercase } from "@valkyr/security";
import { DataConnection, Peer, PeerJSOption } from "peerjs";

type PrivateIdentityData = {
  users: Map<string, UserIdentity>;
};

type IdentityCreationResponse = {
  alias: string;
  secretKey: string;
};

export class IdentityService {
  #connections: DataConnection[] = [];

  #peer: Peer;

  #identity?: PrivateIdentity<PrivateIdentityData>;
  #accessKey?: AccessKey;

  constructor(options: PeerJSOption) {
    this.#peer = new Peer(getAlphaUppercase(6), options);
  }

  // ### Factory

  static for(options: PeerJSOption): Provider {
    return {
      provide: IdentityService,
      useFactory: () => new IdentityService(options)
    };
  }

  // ### Accessors

  get identity(): PrivateIdentity<PrivateIdentityData> {
    if (!this.#identity) {
      throw new Error("Identity Violation: No identity has been resolved");
    }
    return this.#identity;
  }

  get peer() {
    return this.#peer;
  }

  // ### Resolvers

  /**
   * Create a new private identity along with a generated secret key.
   *
   * @param alias    - Alias to identify the identity.
   * @param password - Password used to create account access key.
   */
  async create(alias: string, password: string): Promise<IdentityCreationResponse> {
    const secretKey = generateSecretKey();
    this.#identity = await PrivateIdentity.create<PrivateIdentityData>({ users: new Map() });
    this.#accessKey = AccessKey.resolve(password, secretKey);
    return {
      alias,
      secretKey
    };
  }

  /**
   * Resolve a private identity using a provider service listening on the
   * given peerId.
   *
   * @param peerId - Remote peer listening for authentication requests.
   */
  async resolve(peerId: string): Promise<void> {
    const connection = this.#peer.connect(peerId);

    connection.on("open", () => {
      console.log("Connection established with", peerId);
    });

    connection.on("data", (data) => {
      console.log("Data received from", peerId, data);
    });

    connection.on("error", (err) => {
      console.log("Error occurred with", peerId, err);
    });

    connection.on("close", () => {
      console.log("Connection closed with", peerId);
    });
  }
}
