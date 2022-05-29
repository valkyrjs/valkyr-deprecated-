import { ExportedKeyPair } from "@valkyr/security";

import { RecordLike } from "./Types";

/**
 * UserIdentity
 *
 * This class is designed to hold the individual user identities spawned
 * from a single private identity instance. Each user stores its own
 * public and private key, along with content id and user data. A user
 * identity serves as a key identifier for external services, such as
 * being a member of a organization.
 *
 * User identities are stored and managed by a PrivateIdentity, and are
 * persisted through a PrivateIdentity. User identities are not meant to
 * be shared as a whole, but in parts based on their registrars needs.
 *
 * The most common use cases for sharing includes but is not limited to
 * the users cid, publicKey, and partial data points such as name, email,
 * username, etc.
 */
export type UserIdentitySchema<Data extends RecordLike = RecordLike> = {
  id: string;
  pid: string;
  data: Data;
  keys: {
    signature: ExportedKeyPair;
    vault: ExportedKeyPair;
  };
};
