import { Aggregate, AggregateRoot } from "../Aggregate";
import { Record } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Ledger extends AggregateRoot {
  id!: string;
  members = new Members(this);
  created!: string;

  // ### Aggregate Utilities

  apply(event: Record): void {
    switch (event.type) {
      case "LedgerCreated": {
        this.id = event.data.id;
        this.created = event.created;
        break;
      }
      case "LedgerMemberAdded": {
        this.members.add(event.data);
        break;
      }
    }
  }

  // ### Parsing Utilities

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      id: this.id,
      members: this.members.toJSON(),
      created: this.created
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregates
 |--------------------------------------------------------------------------------
 */

class Members extends Aggregate<Ledger, Member> {}

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type State = {
  /**
   * Unique ledger identifier.
   */
  id: string;

  /**
   * List of peers that has access to the ledger.
   */
  members: Member[];

  /**
   * Hybrid logical clock timestamp when the ledger was created.
   */
  created: string;
};

export type Member = {
  /**
   * Unique identifier of the member relative to the ledger. This is should be
   * generated per active ledger. This way we don't loose content references
   * throughout a ledger when a peer is removed.
   */
  id: string;

  /**
   * A human readable identifier for this member.
   */
  alias: string;

  /**
   * List of roles in the ledger the peer is assigned to.
   */
  roles: string[];

  /**
   * Public key of the identity this peer is assigned to. This is also used to
   * verify identity as well as passing encrypted messages from the ledger.
   */
  publicKey: string;
};
