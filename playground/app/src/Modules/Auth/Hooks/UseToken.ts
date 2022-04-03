import { router } from "@valkyr/react";
import { useEffect } from "react";

import { auth } from "../../../Auth";
import { InputsRef, usePin } from "../../../Components/Pin";

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
        auth
          .sign(email, data())
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
