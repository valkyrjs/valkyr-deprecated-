import { useEffect } from "react";

import { login } from "../../Auth";
import { router } from "../../Router";
import { InputsRef, usePin } from "../UsePin";

type Actions = {
  submit(): void;
};

export function useToken(email: string): [InputsRef, Actions] {
  const [inputs, { focus, data }] = usePin();

  useEffect(() => {
    focus(0);
  }, []);

  return [
    inputs,
    {
      submit() {
        login(email, data())
          .then(() => {
            router.reload();
          })
          .catch((error: any) => {
            alert(error);
          });
      }
    }
  ];
}
