import { useEffect, useState } from "react";

import { Account } from "../Models/Account";
import { Workspace } from "../Models/Workspace";
import { WorkspaceMember } from "../Models/WorkspaceMember";

type State = {
  name: Workspace["name"];
  members: Member[];
};

type Member = {
  name: Account;
};

export function useWorkspaces(accountId: string) {
  const [state, setState] = useState<State>();

  useEffect(() => {
    WorkspaceMember.findByAccount(accountId).then((member) => {
      // Workspace.find({ id: { $in: member.map(m => m.workspaceId) } })
    });
  });

  return state;
}
