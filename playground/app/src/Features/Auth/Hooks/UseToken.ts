import { useEffect } from "react";

import { router } from "../../../Router";
import { InputsRef, usePin } from "../../Form/Hooks/UsePin";
import { sign } from "../Auth";

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
        sign(email, data())
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
