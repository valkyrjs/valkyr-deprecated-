import { LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "@valkyr/ledger";

import { Invite, Member, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: makeEventFactory<Created>("WorkspaceCreated"),
  nameSet: makeEventFactory<NameSet>("WorkspaceNameSet"),
  removed: makeEventFactory<Removed>("WorkspaceRemoved"),
  invite: {
    created: makeEventFactory<InviteCreated>("WorkspaceInviteCreated"),
    removed: makeEventFactory<InviteRemoved>("WorkspaceInviteRemoved")
  },
  member: {
    added: makeEventFactory<MemberAdded>("WorkspaceMemberAdded"),
    removed: makeEventFactory<MemberRemoved>("WorkspaceMemberRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"WorkspaceCreated", Pick<State, "name" | "members">, Auditor>;
export type NameSet = LedgerEvent<"WorkspaceNameSet", Pick<State, "name">, Auditor>;
export type Removed = LedgerEvent<"WorkspaceRemoved", never, never>;

export type InviteCreated = LedgerEvent<"WorkspaceInviteCreated", Invite, Auditor>;
export type InviteRemoved = LedgerEvent<"WorkspaceInviteRemoved", Invite["id"], Auditor>;

export type MemberAdded = LedgerEvent<"WorkspaceMemberAdded", Member, Auditor>;
export type MemberRemoved = LedgerEvent<"WorkspaceMemberRemoved", Pick<Member, "id">, Auditor>;

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

export type Auditor = {
  auditor: Member["id"];
};
