import React, { PropsWithChildren } from "react";

import s from "./Group.module.css";

type Props = PropsWithChildren<{
  size?: number[];
}>;

export function Group({ children }: Props): JSX.Element {
  return <div className={s.group}>{children}</div>;
}
