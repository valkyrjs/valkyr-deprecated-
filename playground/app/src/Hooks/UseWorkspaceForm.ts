import { auth } from "@valkyr/client";

import { Workspace } from "~Data";

import { useForm } from "./UseForm";

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
        form.clear();
      }
    }
  ];
}
