import type { InputHTMLAttributes } from "react";

export type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export type Inputs = {
  [name: string]: HTMLInputElement | HTMLTextAreaElement;
};

export type Options<Data> = {
  focus?: keyof Data;
  defaultValues?: any;
};
