import React from "react";

import { Link } from "../../../Components/Link";
import { useAccount } from "../../Account/Hooks/UseAccount";

export function Avatar() {
  const account = useAccount();
  if (account) {
    return <Account email={account.email} />;
  }
  return <Guest />;
}

function Account({ email }: { email: string }) {
  return (
    <div>
      Hi, {email}. <Link href="/account">Account</Link>
    </div>
  );
}

function Guest() {
  return <div>Guest</div>;
}
