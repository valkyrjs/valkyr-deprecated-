import { InputHTMLAttributes, useRef } from "react";

import { JSON } from "../Types";

export type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export type Inputs = {
  [name: string]: HTMLInputElement | HTMLTextAreaElement;
};

export type Options<Data> = {
  focus?: keyof Data;
  defaultValues?: any;
};

type Actions<Data extends JSON> = {
  register(name: string): Props;

  data(): Data;
  data(filter: string[]): Data;
  data(filter: string): string;
  data(filter?: string | string[]): Data | string;

  clear(): void;
};

export function useForm<Data extends JSON>({ focus, defaultValues = {} }: Options<Data> = {}): Actions<Data> {
  const inputs = useRef<Inputs>({});
  return {
    register(name: string) {
      return {
        ref: (input: HTMLInputElement | HTMLTextAreaElement) => {
          if (!input) {
            return;
          }
          if (focus && focus === name) {
            input.focus();
          }
          if (defaultValues[name] !== undefined) {
            input.value = defaultValues[name];
          }
          inputs.current[name] = input;
        },
        onChange({ target: { value } }) {
          inputs.current[name].value = value;
        }
      };
    },
    data(filter?: string | string[]): Data | string {
      if (filter) {
        if (Array.isArray(filter)) {
          return getDataByFilter(filter, inputs.current);
        }
        console.log(filter, inputs.current);
        return inputs.current[filter].value;
      }
      return getData(inputs.current);
    },
    clear(): void {
      for (const key in inputs.current) {
        inputs.current[key].value = "";
      }
    }
  } as Actions<Data>;
}

function getDataByFilter(keys: string[], inputs: Inputs) {
  const data: any = {};
  for (const key of keys) {
    data[key] = inputs[key].value;
  }
  return data;
}

function getData(inputs: Inputs) {
  const data: any = {};
  for (const key in inputs) {
    data[key] = inputs[key].value;
  }
  return data;
}
