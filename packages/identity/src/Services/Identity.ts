import { Provider } from "@angular/core";
import { PrivateIdentity, UserIdentity } from "@valkyr/identity";
import { JsonRpc, JsonRpcClient } from "@valkyr/network";
import { AccessKey, generateSecretKey, getAlphaUppercase } from "@valkyr/security";

import { IdentityData } from "../IdentityStorage";
import { IdentityServiceOptions } from "./Types";

type PrivateIdentityData = {
  users: Record<string, UserIdentity>;
};

export class IdentityService extends JsonRpcClient {
  #alias?: string;
  #identity?: PrivateIdentity<PrivateIdentityData>;
  #accessKey?: AccessKey;

  constructor(options: IdentityServiceOptions) {
    super(getAlphaUppercase(6), options);
  }

  // ### Factory

  static for(options: IdentityServiceOptions): Provider {
    return {
      provide: IdentityService,
      useFactory: () => new IdentityService(options)
    };
  }

  // ### Accessors

  get isAuthenticated(): boolean {
    return this.#identity !== undefined;
  }

  get alias(): string {
    if (!this.#alias) {
      throw new Error("Identity Violation: No alias has been resolved");
    }
    return this.#alias;
  }

  get identity(): PrivateIdentity<PrivateIdentityData> {
    if (!this.#identity) {
      throw new Error("Identity Violation: No identity has been resolved");
    }
    return this.#identity;
  }

  get accessKey(): AccessKey {
    if (!this.#accessKey) {
      throw new Error("Identity Violation: No access key has been resolved");
    }
    return this.#accessKey;
  }

  // ### Resolvers

  /**
   * Create a new private identity along with a generated secret key.
   *
   * @param alias    - Alias to identify the identity.
   * @param password - Password used to create account access key.
   */
  async create(alias: string, password: string): Promise<string> {
    const secretKey = generateSecretKey();
    this.#alias = alias;
    this.#identity = await PrivateIdentity.create<PrivateIdentityData>({ users: {} });
    this.#accessKey = AccessKey.resolve(password, secretKey);
    return secretKey;
  }

  /**
   * Resolve a private identity using a provider service listening on the
   * given peerId.
   *
   * @param peerId - Remote peer listening for authentication requests.
   */
  async authorize(peerId: string, alias: string): Promise<any> {
    const res = await this.call<{ status: string; data: IdentityData }>(peerId, "authorize", [alias]);

    if (res instanceof JsonRpc.ErrorResponse) {
      return res.error.message;
    }

    switch (res.result.status) {
      case "NOT_FOUND": {
        alert("No identity found under provided alias");
        break;
      }
      case "FOUND": {
        this.#alias = alias;
        this.#accessKey = new AccessKey(res.result.data.accessKey);
        this.#identity = await PrivateIdentity.import(res.result.data.identity);
        break;
      }
      case "REJECTED": {
        alert("Authentication request rejected by provider");
        break;
      }
    }
  }

  async persist(peerId: string): Promise<any> {
    if (this.isAuthenticated === false) {
      throw new Error("Identity Service Violation: Cannot persist unauthenticated identity");
    }
    return this.call(peerId, "persist", [
      this.alias,
      {
        identity: await this.identity.export(),
        accessKey: this.#accessKey!.value
      }
    ]);
  }
}
