import React, { InputHTMLAttributes } from "react";

import s from "./TextInput.module.scss";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange: (value: string) => void;
};

export function TextInput({ onChange, ...props }: Props) {
  return (
    <input
      {...props}
      className={s.input}
      onChange={({ target: { value } }) => {
        onChange(value);
      }}
    />
  );
}
