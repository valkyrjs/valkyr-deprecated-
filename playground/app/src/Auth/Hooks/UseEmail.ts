import { useForm } from "@valkyr/react";

import { useProvider } from "~App";

import type { AuthDispatch } from "../Reducer";
import { AuthService } from "../Services/AuthService";

type State = ReturnType<typeof useForm>["register"];

type Actions = {
  submit(event: React.FormEvent<HTMLFormElement>): void;
};

type Data = {
  email: string;
};

export function useEmail(dispatch: AuthDispatch): [State, Actions] {
  const form = useForm<Data>({ focus: "email" });
  const auth = useProvider(AuthService);

  return [
    form.register,
    {
      submit(event) {
        event.preventDefault();
        const { email } = form.data();
        if (email === "") {
          return alert("ENTER AN EMAIL");
        }
        auth.create(email).then(() => {
          dispatch({ type: "SHOW_PIN", email });
        });
      }
    }
  ];
}
