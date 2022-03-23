import { Workspace } from "../Models/Workspace";
import { auth } from "../Modules/Auth";
import { useForm } from "../Modules/Form/Hooks/UseForm";

type State = ReturnType<typeof useForm>["register"];

type Actions = {
  submit(event: React.FormEvent<HTMLFormElement>): void;
};

type Data = {
  name: string;
};

export function useWorkspaceForm(): [State, Actions] {
  const form = useForm<Data>();
  return [
    form.register,
    {
      submit(event) {
        event.preventDefault();
        const { name } = form.data();
        Workspace.create(name, auth.auditor);
      }
    }
  ];
}
