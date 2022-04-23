import { useProvider } from "~App";
import { useForm } from "~Library/Hooks/UseForm";

import { AuthService } from "../../Auth/Services/AuthService";
import { Workspace } from "../Model";

type State = ReturnType<typeof useForm>["register"];

type Actions = {
  submit(event: React.FormEvent<HTMLFormElement>): void;
};

type Data = {
  name: string;
};

export function useWorkspaceForm(): [State, Actions] {
  const auth = useProvider(AuthService);
  const form = useForm<Data>();
  return [
    form.register,
    {
      submit(event) {
        event.preventDefault();
        const { name } = form.data();
        Workspace.create(name, auth.auditor);
        form.clear();
      }
    }
  ];
}
