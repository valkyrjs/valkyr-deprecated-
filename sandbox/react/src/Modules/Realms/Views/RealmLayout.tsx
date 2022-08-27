import { controller } from "../Controllers/RealmLayoutController";

export const RealmLayout = controller.view(
  ({ state: { content }, actions: { goToHome, goToMembers, goToPages, goToInvites } }) => {
    return (
      <div>
        <div>
          <button onClick={goToHome}>Home</button>
          <button onClick={goToMembers}>Members</button>
          <button onClick={goToPages}>Pages</button>
          <button onClick={goToInvites}>Invites</button>
        </div>
        <div>{content}</div>
      </div>
    );
  }
);
