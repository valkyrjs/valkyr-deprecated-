import { ExportedKeyPair, KeyPair } from "@valkyr/security";

import { UserIdentity } from "./UserIdentity";

/**
 * PrivateIdentity
 *
 * This class is designed to locally store a consumer nodes private identity
 * information. Such as all the users it has created, the  users special
 * access key (derived from alias + passphrase + secret key), and JsonWebToken
 * used to facilitate communication with a identity provider node.
 *
 * This identity holds very sensitive security data and should be handled
 * with great care. Make sure not to store this in a environment that is
 * accessible by actors which should not be allowed full access to the
 * nodes personal details and security keys.
 *
 * When resubmitting the details of the private identity to identity provider
 * nodes. Or when persisting the data locally, only send or store the result
 * from the `.encrypt()` method.
 *
 * NOTE! Never store this identity as is in any shape or form, always use
 * the `.encrypt()` method for safe storage!
 *
 * NOTE! A private identity is never to be shared with third parties. It holds
 * all the security information for a consumer node. For third party identity
 * sharing use the UserIdentity class.
 *
 * @see {@link UserIdentity}
 */
export class PrivateIdentity<Data extends PrivateIdentityData> {
  #data: Data;
  #keys: KeyPair;

  constructor(props: PrivateIdentityProps<Data>) {
    this.#data = props.data;
    this.#keys = props.keys;
  }

  // ### Instantiator

  static async create<Data extends PrivateIdentityData>(data: Data): Promise<PrivateIdentity<Data>> {
    return new PrivateIdentity({
      data,
      keys: await KeyPair.create()
    });
  }

  static async import<Data extends PrivateIdentityData>(schema: PrivateIdentitySchema): Promise<PrivateIdentity<Data>> {
    const keys = await KeyPair.import(schema.keys);
    return new PrivateIdentity({
      data: await keys.decrypt(schema.data),
      keys
    });
  }

  // ### Accessors

  get data(): Data {
    return this.#data;
  }

  get encrypt() {
    return this.#keys.encrypt.bind(this.#keys);
  }

  get decrypt() {
    return this.#keys.decrypt.bind(this.#keys);
  }

  // ### Utilities

  async addUser(name: string): Promise<void> {
    const user = await UserIdentity.create({ name });
    this.data.users[user.cid] = user;
  }

  async export(): Promise<PrivateIdentitySchema> {
    return {
      data: await this.encrypt(this.data),
      keys: await this.#keys.export()
    };
  }
}

export type PrivateIdentitySchema = {
  data: string;
  keys: ExportedKeyPair;
};

type PrivateIdentityProps<Data extends PrivateIdentityData> = {
  data: Data;
  keys: KeyPair;
};

type PrivateIdentityData = {
  users: Record<string, UserIdentity>;
} & Record<string, unknown>;
