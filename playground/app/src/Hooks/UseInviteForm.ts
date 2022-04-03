import { Workspace } from "../Data";
import { useForm } from "./UseForm";

type State = ReturnType<typeof useForm>["register"];

type Actions = {
  submit(event: React.FormEvent<HTMLFormElement>): void;
};

type Data = {
  email: string;
};

export function useInviteForm(workspaceId: string): [State, Actions] {
  const form = useForm<Data>();
  return [
    form.register,
    {
      submit(event) {
        event.preventDefault();
        Workspace.findById(workspaceId)
          .then((workspace) => {
            if (workspace === undefined) {
              throw new Error("Invite Violation: Could not resolve workspace");
            }
            const email = form.data("email");
            if (!email) {
              throw new Error("Must provided email");
            }
            workspace.members.invite(email).then(console.log).catch(console.log);
            form.clear();
          })
          .catch(console.log);
      }
    }
  ];
}
