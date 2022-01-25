import { token } from "../../Auth";
import type { AuthDispatch } from "../../Reducers/Auth";
import { useForm } from "../UseForm";

type State = ReturnType<typeof useForm>["register"];

type Actions = {
  submit(event: React.FormEvent<HTMLFormElement>): void;
};

type Data = {
  email: string;
};

export function useEmail(dispatch: AuthDispatch): [State, Actions] {
  const form = useForm<Data>({ focus: "email" });
  return [
    form.register,
    {
      submit(event) {
        event.preventDefault();
        const { email } = form.data();
        if (email === "") {
          return alert("ENTER AN EMAIL");
        }
        token(email).then(() => {
          dispatch({ type: "SHOW_PIN", email });
        });
      }
    }
  ];
}
