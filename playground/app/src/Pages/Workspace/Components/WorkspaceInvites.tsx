import styled from "styled-components";

import { useWorkspaceInvites } from "~Hooks/UseWorkspaceInvites";

type Props = {
  workspaceId: string;
};

export function WorkspaceInvites({ workspaceId }: Props) {
  const [invites, loading, error] = useWorkspaceInvites(workspaceId);

  if (loading === true) {
    return <div>Loading</div>;
  }

  if (error !== undefined) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {invites.map((invite) => (
        <S.Invite key={invite.token}>
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
