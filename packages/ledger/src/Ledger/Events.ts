import { LedgerEvent, LedgerEventRecord, makeEventFactory } from "../Event";
import { Member } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: makeEventFactory<Created>("LedgerCreated"),
  member: {
    added: makeEventFactory<MemberAdded>("LedgerMemberAdded")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"LedgerCreated", never, never>;
export type MemberAdded = LedgerEvent<"LedgerMemberAdded", Member, never>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | MemberAdded;

export type Record = LedgerEventRecord<Event>;
