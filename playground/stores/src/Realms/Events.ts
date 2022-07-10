import { LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "@valkyr/ledger";

import { Invite, Member, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const created = makeEventFactory<Created>("RealmCreated");
export const nameSet = makeEventFactory<NameSet>("RealmNameSet");
export const removed = makeEventFactory<Removed>("RealmRemoved");
export const invite = {
  created: makeEventFactory<InviteCreated>("RealmInviteCreated"),
  removed: makeEventFactory<InviteRemoved>("RealmInviteRemoved")
};
export const member = {
  added: makeEventFactory<MemberAdded>("RealmMemberAdded"),
  removed: makeEventFactory<MemberRemoved>("RealmMemberRemoved")
}

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"RealmCreated", Pick<State, "name" | "members">, RealmMeta & AuditorMeta>;
export type NameSet = LedgerEvent<"RealmNameSet", Pick<State, "name">, RealmMeta & AuditorMeta>;
export type Removed = LedgerEvent<"RealmRemoved", never, never>;

export type InviteCreated = LedgerEvent<"RealmInviteCreated", Invite, RealmMeta & AuditorMeta>;
export type InviteRemoved = LedgerEvent<"RealmInviteRemoved", Invite["id"], RealmMeta & AuditorMeta>;

export type MemberAdded = LedgerEvent<"RealmMemberAdded", Member, RealmMeta & AuditorMeta>;
export type MemberRemoved = LedgerEvent<"RealmMemberRemoved", Pick<Member, "id">, RealmMeta & AuditorMeta>;

/*
 |--------------------------------------------------------------------------------
 | Event Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | NameSet | Removed | InviteCreated | InviteRemoved | MemberAdded | MemberRemoved;

export type EventRecord = LedgerEventToLedgerRecord<Event>;

/*
 |--------------------------------------------------------------------------------
 | Event Meta
 |--------------------------------------------------------------------------------
 */

export type RealmMeta = {
  realm: string;
};

export type AuditorMeta = {
  auditor: Member["id"];
};
