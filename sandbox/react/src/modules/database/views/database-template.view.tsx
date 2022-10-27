import { User } from "../models/user.entity";
import { controller } from "./database-template.controller";

export const DatabaseTemplateView = controller.view(({ state: { users } }) => {
  return (
    <div>
      <button onClick={() => User.faker()}>Create User</button>
      <button onClick={() => User.faker(500)}>Create 500 Users</button>
      <div>Users | {users.length}</div>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
});
