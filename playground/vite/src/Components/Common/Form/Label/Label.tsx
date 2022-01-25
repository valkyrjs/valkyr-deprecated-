import React from "react";

import s from "./Label.module.css";

type Props = {
  value?: string;
};

export function Label({ value }: Props): JSX.Element | null {
  if (!value) {
    return null;
  }
  return <div className={s.label}>{value}</div>;
}
