import React from "react";

import { useAccount } from "../hooks/useAccount";

export function Avatar() {
  const account = useAccount();
  if (account) {
    return <Account email={account.email} />;
  }
  return <Guest />;
}

function Account({ email }: { email: string }) {
  return <div>Hi, {email}</div>;
}

function Guest() {
  return <div>Guest</div>;
}
