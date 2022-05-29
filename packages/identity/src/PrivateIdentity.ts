import { ExportedKeyPair } from "@valkyr/security";

import { RecordLike } from "./Types";

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
 */
export type PrivateIdentitySchema<Data extends RecordLike = RecordLike> = {
  id: string;
  data: Data;
  keys: {
    signature: ExportedKeyPair;
    vault: ExportedKeyPair;
  };
};
