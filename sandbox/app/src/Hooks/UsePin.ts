import { MutableRefObject, useRef } from "react";

export type Inputs = Map<number, HTMLInputElement>;
export type InputsRef = MutableRefObject<Inputs>;

export type Actions = {
  clear(): void;
  focus(index: number): void;
  data(): string;
};

export function usePin(): [InputsRef, Actions] {
  const inputs = useRef<Inputs>(new Map());
  return [
    inputs,
    {
      clear() {
        inputs.current.forEach((input) => {
          input.value = "";
        });
      },
      focus(index: number) {
        inputs.current.get(index)?.focus();
      },
      data(): string {
        let data = "";
        for (const key of inputs.current.keys()) {
          const value = inputs.current.get(key)?.value;
          if (value) {
            data += value;
          }
        }
        return data;
      }
    }
  ];
}
