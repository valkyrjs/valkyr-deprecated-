/**
 * WARNING! Once a peer has been added to the ledger they will have the
 * encryption key that gives read access to the ledger. When a peer
 * is removed, the remover should generate a new encryption key for
 * the ledger and assign the new key to each remaining peer.
 *
 * This also means that when a member is removed all the events in the
 * ledger needs to be re-encrypted using the new key.
 */
export type Ledger = {
  /**
   * Unique ledger identifier.
   */
  id: string;

  /**
   * List of stream ids that belongs to the ledger.
   */
  streams: string[];

  /**
   * List of sub ledgers. Sub ledgers are a side effect of events which
   * leads to data separation which has its own list of peers and roles.
   */
  ledgers: string[];

  /**
   * List of peers that has access to the ledger.
   */
  peers: LedgerPeer[];

  /**
   * Hybrid logical clock timestamp when the ledger was created.
   */
  created: string;

  /**
   * Hash value of the ledger used for quick lookup of new streams during ledger
   * push and pull requests. Hash value should be calculated in order of when the
   * streams were created.
   */
  hash: string;
};

export type LedgerPeer = {
  /**
   * Unique identifier of the peer relative to the ledger. This is should be
   * generates per active ledger. This way we don't loose content references
   * throughout a ledger when a peer is removed.
   */
  id: string;

  /**
   * List of roles in the ledger the peer is assigned to.
   */
  roles: string[];

  /**
   * Public key of the identity this peer is assigned to. This is also used to
   * verify identity as well as passing encrypted messages from the ledger.
   */
  publicKey: string;

  /**
   * An encrypted secret key using the peers public key. This contains the
   * encryption key which is used to encrypt and decrypt events on the ledger.
   *
   * When a ledger peer creates a new invitation they will also create a
   * unique secret key based on the invitees public key so that if they
   * accept the invite they will have immediate access to the ledger.
   */
  secretKey: string;
};
