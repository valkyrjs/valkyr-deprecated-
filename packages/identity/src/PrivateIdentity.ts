import { ExportedKeyPair, KeyPair } from "@valkyr/security";

import { UserIdentity, UserIdentitySchema } from "./UserIdentity";

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
export class PrivateIdentity<Data extends PrivateIdentityData = PrivateIdentityData> {
  #users: UserIdentity[];
  #data: Data;
  #keys: KeyPair;

  constructor(props: PrivateIdentityProps<Data>) {
    this.#users = props.users;
    this.#data = props.data;
    this.#keys = props.keys;
  }

  // ### Instantiator

  static async create<Data extends PrivateIdentityData>(data: Data = {} as Data): Promise<PrivateIdentity<Data>> {
    return new PrivateIdentity({
      users: [],
      data,
      keys: await KeyPair.create()
    });
  }

  static async import<Data extends PrivateIdentityData>(schema: PrivateIdentitySchema): Promise<PrivateIdentity<Data>> {
    const keys = await KeyPair.import(schema.keys);
    const data = await keys.decrypt<Data>(schema.data);
    const users = await keys.decrypt<UserIdentitySchema[]>(schema.users);

    for (const user of users) {
      console.log("User", await UserIdentity.import(user));
    }

    return new PrivateIdentity({
      users: await Promise.all(users.map((user) => UserIdentity.import(user))),
      data,
      keys
    });
  }

  // ### Accessors

  get users(): UserIdentity[] {
    return this.#users;
  }

  get data(): Data {
    return this.#data;
  }

  get encrypt() {
    return this.keys.encrypt.bind(this.#keys);
  }

  get decrypt() {
    return this.keys.decrypt.bind(this.#keys);
  }

  get keys() {
    return this.#keys;
  }

  // ### Utilities

  async export(): Promise<PrivateIdentitySchema> {
    const users = await Promise.all(this.users.map((user) => user.export()));
    return {
      users: await this.encrypt(users),
      data: await this.encrypt(this.data),
      keys: await this.#keys.export()
    };
  }
}

export type PrivateIdentitySchema = {
  users: string;
  data: string;
  keys: ExportedKeyPair;
};

type PrivateIdentityProps<Data extends PrivateIdentityData> = {
  users: UserIdentity[];
  data: Data;
  keys: KeyPair;
};

type PrivateIdentityData = Record<string, unknown>;
