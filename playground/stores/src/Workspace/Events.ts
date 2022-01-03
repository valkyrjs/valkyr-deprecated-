import { createEvent, Event as LedgerEvent } from "@valkyr/ledger";

import { Invite, Member, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<Created>("WorkspaceCreated"),
  nameSet: createEvent<NameSet>("WorkspaceNameSet"),
  removed: createEvent<Removed>("WorkspaceRemoved"),
  invite: {
    created: createEvent<InviteCreated>("WorkspaceInviteCreated"),
    removed: createEvent<InviteRemoved>("WorkspaceInviteRemoved")
  },
  member: {
    added: createEvent<MemberAdded>("WorkspaceMemberAdded"),
    removed: createEvent<MemberRemoved>("WorkspaceMemberRemoved")
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

/*
  |--------------------------------------------------------------------------------
  | Event Meta
  |--------------------------------------------------------------------------------
  */

export type Auditor = {
  auditor: Member["id"];
};
