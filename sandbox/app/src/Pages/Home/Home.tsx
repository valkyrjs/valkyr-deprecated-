import React from "react";

import { Avatar } from "../../Components/Auth/Avatar";
import s from "./Home.module.scss";

export function Home(): JSX.Element | null {
  return (
    <div className={s.container}>
      <Avatar />
    </div>
  );
}
