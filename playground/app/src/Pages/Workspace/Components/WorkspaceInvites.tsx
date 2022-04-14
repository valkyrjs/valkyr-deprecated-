import styled from "styled-components";

import { useWorkspaceInvites } from "~Hooks/UseWorkspaceInvites";

import { WorkspaceInviteForm } from "./WorkspaceInviteForm";

type Props = {
  workspaceId: string;
};

export function WorkspaceInvites({ workspaceId }: Props) {
  const invites = useWorkspaceInvites(workspaceId);
  return (
    <div>
      <WorkspaceInviteForm workspaceId={workspaceId} />
      {invites.map((invite) => (
        <S.Invite key={invite.email}>
          {invite.email}
          <S.Button
            onClick={() => {
              console.log("TODO");
            }}
          >
            Delete
          </S.Button>
        </S.Invite>
      ))}
    </div>
  );
}

const S = {
  Invite: styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
  `,
  Button: styled.button`
    margin-left: 10px;
  `
};
