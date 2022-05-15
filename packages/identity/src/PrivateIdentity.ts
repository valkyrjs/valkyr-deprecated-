import { AccessKey } from "@valkyr/security";

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
export class PrivateIdentity {
  #jwt: string;
  #users: Users;
  #accessKey: AccessKey;

  constructor(props: PrivateIdentityProps) {
    this.#users = props.users;
    this.#jwt = props.jwt;
    this.#accessKey = props.accessKey;
  }

  // ### Instantiator

  static async resolve(schema: PrivateIdentitySchema) {
    const decrypted = schema.accessKey.decrypt<Record<string, UserIdentitySchema>>(schema.data);
    const users: Users = new Map();
    for (const user in decrypted) {
      users.set(user, await UserIdentity.resolve(decrypted[user]));
    }
    return new PrivateIdentity({
      users,
      jwt: schema.jwt,
      accessKey: schema.accessKey
    });
  }

  /**
   * Token used to authorize the identity to make changes to itself on the
   * server side identity provider.
   */
  get token() {
    return this.#jwt;
  }

  /**
   * List of users registered under this identity.
   */
  get users() {
    return Array.from(this.#users.values());
  }

  /**
   * Get public user identity based on provided content id.
   *
   * @param cid - Content id the user details are stored under.
   */
  user(cid: string): UserIdentity | undefined {
    return this.#users.get(cid);
  }

  /**
   * Returns encrypted list of users which can be safely passed back to the
   * server for persistent storage.
   *
   * @returns encrypted user list
   */
  encrypt() {
    return this.#accessKey.encrypt(this.users);
  }
}

type PrivateIdentitySchema = {
  data: string;
  jwt: string;
  accessKey: AccessKey;
};

type PrivateIdentityProps = {
  users: Users;
  jwt: string;
  accessKey: AccessKey;
};

type Users = Map<string, UserIdentity>;
