import { Ledger } from "@valkyr/ledger";

import { Invite, Member, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: Ledger.createEvent<Created>("WorkspaceCreated"),
  nameSet: Ledger.createEvent<NameSet>("WorkspaceNameSet"),
  removed: Ledger.createEvent<Removed>("WorkspaceRemoved"),
  invite: {
    created: Ledger.createEvent<InviteCreated>("WorkspaceInviteCreated"),
    removed: Ledger.createEvent<InviteRemoved>("WorkspaceInviteRemoved")
  },
  member: {
    added: Ledger.createEvent<MemberAdded>("WorkspaceMemberAdded"),
    removed: Ledger.createEvent<MemberRemoved>("WorkspaceMemberRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type Created = Ledger.Event<"WorkspaceCreated", Pick<State, "name" | "members">, Auditor>;
export type NameSet = Ledger.Event<"WorkspaceNameSet", Pick<State, "name">, Auditor>;
export type Removed = Ledger.Event<"WorkspaceRemoved", never, never>;

export type InviteCreated = Ledger.Event<"WorkspaceInviteCreated", Invite, Auditor>;
export type InviteRemoved = Ledger.Event<"WorkspaceInviteRemoved", Invite["id"], Auditor>;

export type MemberAdded = Ledger.Event<"WorkspaceMemberAdded", Member, Auditor>;
export type MemberRemoved = Ledger.Event<"WorkspaceMemberRemoved", Pick<Member, "id">, Auditor>;

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
