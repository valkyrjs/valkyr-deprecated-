import { decrypt, encrypt, KeyLike } from "@valkyr/security";

import { PublicIdentity } from "./PublicIdentity";
import { UserIdentity } from "./UserIdentity";

type RecordLike = Record<string, unknown>;

type Props<Profile extends RecordLike = any, Data extends RecordLike = any> = {
  cid: string;
  profile: Profile;
  data: Data;
  publicKey: KeyLike;
  privateKey: KeyLike;
};

export class PrivateIdentity<Profile extends RecordLike = any, Data extends RecordLike = any> {
  readonly cid: string;
  readonly profile: Profile;
  readonly data: Data;

  #publicKey: KeyLike;
  #privateKey: KeyLike;

  constructor(props: Props) {
    this.cid = props.cid;
    this.profile = props.profile;
    this.data = props.data;
    this.#publicKey = props.publicKey;
    this.#privateKey = props.privateKey;
  }

  /**
   * Resolves a private identity profile with given public and user identity
   * instances. This maps the user identity public information along with
   * decrypted private data using the public identity keys for the given user
   * profile.
   *
   * User profiles keypair is provided by the public identity instance.
   *
   * @param userIdentity   - User identity to map to the private identity.
   * @param publicIdentity - Public identity instance to retrieve keypair from.
   */
  static async resolve(userIdentity: UserIdentity, publicIdentity: PublicIdentity): Promise<PrivateIdentity> {
    const { publicKey, privateKey } = publicIdentity.keys.get(userIdentity.cid) ?? {};
    if (!publicKey || !privateKey) {
      throw new Error("Private Identity Violation: Could not resolve identity keypair");
    }
    return new PrivateIdentity({
      cid: userIdentity.cid,
      profile: userIdentity.profile,
      data: await Promise.all(userIdentity.private.map((value) => decrypt(value, privateKey))),
      publicKey,
      privateKey
    });
  }

  get publicKey(): KeyLike {
    return this.#publicKey;
  }

  get privateKey(): KeyLike {
    return this.#privateKey;
  }

  async encrypt<T extends Record<string, unknown>>(obj: T): Promise<string> {
    return encrypt(obj, this.publicKey);
  }

  async decrypt<T extends Record<string, unknown>>(cypherText: string): Promise<T> {
    return decrypt(cypherText, this.privateKey);
  }
}
