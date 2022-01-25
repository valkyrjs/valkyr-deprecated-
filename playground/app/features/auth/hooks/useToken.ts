import { useEffect } from "react";

import { router } from "../../../router";
import { InputsRef, usePin } from "../../form/hooks/usePin";
import { login } from "../auth";

type Actions = {
  submit(): void;
};

export function useToken(email: string): [InputsRef, Actions] {
  const [inputs, { focus, data }] = usePin();

  useEffect(() => {
    focus(0);
  });

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
