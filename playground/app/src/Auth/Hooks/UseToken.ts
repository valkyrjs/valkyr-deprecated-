import { useEffect } from "react";

import { useProvider, useRouter } from "~App";

import { AuthService } from "../Services/AuthService";
import { InputsRef, usePin } from "./UsePin";

type Actions = {
  submit(): void;
};

export function useToken(email: string): [InputsRef, Actions] {
  const [inputs, { focus, data }] = usePin();
  const auth = useProvider(AuthService);
  const router = useRouter();

  useEffect(() => {
    focus(0);
  });

  return [
    inputs,
    {
      submit() {
        auth
          .sign(email, data())
          .then(() => {
            router.goTo("/");
          })
          .catch((error: any) => {
            alert(error);
          });
      }
    }
  ];
}
