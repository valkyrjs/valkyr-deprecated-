import {
  decryptAccessKey,
  encryptAccessKey,
  exportKeyPair,
  generateAccessKey,
  generateHash,
  generateKeyPair,
  generateSecretKey,
  getId,
  importKeyPair,
  KeyLike
} from "@valkyr/security";

import { UserIdentity } from "./UserIdentity";

type Props = {
  pid: string;
  keys: Map<string, ProfileKey>;
  accessKey: string;
};

type ProfileKey = {
  cid: string;
  publicKey: KeyLike;
  privateKey: KeyLike;
};

type RecordLike = Record<string, unknown>;

export class PublicIdentity {
  readonly pid: string;
  readonly keys: Map<string, ProfileKey>;

  #accessKey: string;

  constructor(props: Props) {
    this.pid = props.pid;
    this.keys = props.keys;
    this.#accessKey = props.accessKey;
  }

  /**
   * Create a new public identity using the initial credentials given.
   *
   * This generates a personal identifier using the provided alias and randomly generated
   * secret key. As well as generating a access key using the provided password and
   * generates secret key.
   *
   * The personal identifier is used to lookup the public identity in the identity provider
   * pool. And the access key is used to decrypt the use identity credentials along with
   * their individual keypair.
   *
   * @param alias    - Initial alias to generate PID from.
   * @param password - Initial password to generate access key from.
   * @returns
   */
  static create(alias: string, password: string): PublicIdentity {
    const secretKey = generateSecretKey();
    return new PublicIdentity({
      pid: this.getPID(alias, secretKey),
      keys: new Map(),
      accessKey: generateAccessKey(password + secretKey, secretKey)
    });
  }

  /**
   * Utility method to generate a deterministic personal identifier using provided
   * alias and secret key.
   */
  static getPID(alias: string, secretKey: string): string {
    return generateHash(alias + secretKey);
  }

  /**
   * Public identity resolves takes a pid, encrypted user identities, and an access key
   * to create a decrypted public identity instance.
   *
   * @param pid       - Personal identifier.
   * @param encrypted - Encrypted user identity map.
   * @param accessKey - Access key used to decrypt the user identities.
   */
  static async resolve(pid: string, encrypted: string, accessKey: string): Promise<PublicIdentity> {
    const decrypted = decryptAccessKey(encrypted, accessKey);
    const keys = new Map<string, ProfileKey>();
    for (const key of decrypted) {
      keys.set(key, { cid: key.cid, ...(await importKeyPair(key.publicKey, key.privateKey)) });
    }
    return new PublicIdentity({
      pid,
      keys,
      accessKey
    });
  }

  /**
   * Creates a new user identity which is used as a consumable public entity within
   * the system.
   *
   * @param profile - Initial profile data to add to the user. (Default: {})
   */
  async createUserIdentity(profile: RecordLike = {}): Promise<UserIdentity> {
    const cid = getId();
    const { publicKey, privateKey } = await generateKeyPair();

    this.keys.set(cid, {
      cid,
      publicKey,
      privateKey
    });

    return new UserIdentity({
      cid,
      profile,
      private: [],
      publicKey
    });
  }

  /**
   * Generates a JSON representation of the public identity which can be safely
   * stored and/or transferred across the network.
   *
   * It encrypts all the recorded keys using the access key so that it cannot
   * be seen or accessed by any unauthorized actor.
   */
  async toJSON() {
    const keys = [];
    for (const { cid, publicKey, privateKey } of this.keys.values()) {
      keys.push({ cid, ...exportKeyPair(publicKey, privateKey) });
    }
    return {
      pid: this.pid,
      keys: encryptAccessKey(keys, this.#accessKey)
    };
  }
}
