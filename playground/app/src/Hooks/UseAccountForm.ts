import { Account } from "~Data";

import { useForm } from "./UseForm";

type State = ReturnType<typeof useForm>["register"];

type Actions = {
  submit(event: React.FormEvent<HTMLFormElement>): void;
};

type Data = {
  given?: string;
  family?: string;
  email?: string;
};

export function useAccountForm(account: Account): [State, Actions] {
  const form = useForm<Data>({
    defaultValues: {
      given: account.name?.given,
      family: account.name?.family,
      email: account.email
    }
  });
  return [
    form.register,
    {
      submit(event) {
        event.preventDefault();
        const { given, family, email } = form.data();
        account.setName({ given, family });
        account.setEmail(email);
      }
    }
  ];
}
