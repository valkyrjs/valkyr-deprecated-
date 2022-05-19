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
  provider?: string;

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
    return this.#alias !== undefined && this.#identity !== undefined && this.#accessKey !== undefined;
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

  get auditor() {
    const user = this.getSelectedUser();
    if (user === undefined) {
      throw new Error("Identity Violation: No auditor has been resolved");
    }
    return user.cid;
  }

  get accessKey(): AccessKey {
    if (!this.#accessKey) {
      throw new Error("Identity Violation: No access key has been resolved");
    }
    return this.#accessKey;
  }

  // ### Factory Utilities

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

  async init(): Promise<void> {
    const value = localStorage.getItem("identity") || sessionStorage.getItem("identity");
    if (value) {
      const data = JSON.parse(value) as IdentityData;
      await this.resolve(data.alias, data);
    }
  }

  async resolve(alias: string, data: IdentityData): Promise<void> {
    const { accessKey, identity } = await this.import(data);
    this.#alias = alias;
    this.#accessKey = accessKey;
    this.#identity = identity;
  }

  // ### Authorization Utilities

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
        await this.resolve(alias, res.result.data);
        break;
      }
      case "REJECTED": {
        alert("Authentication request rejected by provider");
        break;
      }
    }
  }

  // ### Persistence Utilities

  async persistToProvider(providerId: string): Promise<any> {
    return this.call(providerId, "persist", [this.alias, await this.export(this.accessKey)]);
  }

  async persistToDevice(remember = false) {
    const identity = JSON.stringify(await this.export(this.accessKey));
    if (remember === true) {
      localStorage.setItem("identity", identity);
    } else {
      sessionStorage.setItem("identity", identity);
    }
  }

  // ### User Utilities

  setSelectedUser(cid: string, remember = false) {
    if (remember === true) {
      localStorage.setItem("user", cid);
    } else {
      sessionStorage.setItem("user", cid);
    }
  }

  getSelectedUser(): UserIdentity | undefined {
    const cid = localStorage.getItem("user") || sessionStorage.getItem("user") || undefined;
    if (cid === undefined) {
      return undefined;
    }
    return this.identity.getUser(cid);
  }

  // ### Cryptographic Utilities

  /**
   * Import a resolved identity object based on the given encrypted identity data.
   *
   * @remarks The access key can be part of the identity data or has to be provided
   * in the rawAccessKey argument. If no valid access key is found an error is
   * thrown.
   *
   * When access key is not part of the data this signals that the key must be
   * generated through the `AccessKey.resolve` method which is created through the
   * accounts `password` and `secretKey`.
   *
   * @see {@link AccessKey.ts}
   *
   * @param data         - Identity data to resolve.
   * @param rawAccessKey - Access key used to decrypt the data. (Optional)
   */
  async import(data: IdentityData, rawAccessKey?: string) {
    const key = data.accessKey ?? rawAccessKey;
    if (key === undefined) {
      throw new Error("Identity Import Violation: Cannot import identity, access key is missing");
    }
    const accessKey = new AccessKey(key);
    const identity = await PrivateIdentity.import(accessKey.decrypt(data.identity));
    return {
      accessKey,
      identity
    };
  }

  /**
   * Export the current identity to a storable identity data object.
   *
   * TODO: Make the access key false by default, right now its true for development
   * convenience. But should optimally be false so that its always a conscious opt
   * in to avoid security leaks.
   *
   * @param accessKey - Access key used to encrypt the identity.
   */
  async export(accessKey: AccessKey, storeAccessKey = true): Promise<IdentityData> {
    if (this.isAuthenticated === false) {
      throw new Error("Identity Export Violation: No authenticated identity to export");
    }
    const identity = await this.identity.export();
    return {
      alias: this.alias,
      identity: accessKey.encrypt(identity),
      accessKey: storeAccessKey === true ? accessKey.value : undefined
    };
  }

  async publicKey(): Promise<string> {
    return this.identity.keys.exportPublicKey();
  }

  async privateKey(): Promise<string> {
    return this.identity.keys.exportPublicKey();
  }
}
