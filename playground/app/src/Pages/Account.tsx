import React from "react";

import { Account } from "../Data";
import { useAccount } from "../Hooks/UseAccount";
import { useAccountForm } from "../Hooks/UseAccountForm";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function AccountPage() {
  const account = useAccount();

  if (!account) {
    return (
      <div>
        <h1>Account</h1>
        Loading
      </div>
    );
  }

  return (
    <div>
      <h1>Account</h1>
      <AccountForm account={account} />
    </div>
  );
}

function AccountForm({ account }: { account: Account }) {
  const [register, { submit }] = useAccountForm(account);
  return (
    <form onSubmit={submit}>
      <input placeholder="Your first name" {...register("given")} />
      <input placeholder="Your last name" {...register("family")} />
      <input placeholder="Your email address" {...register("email")} />
      <button type="submit">Continue</button>
    </form>
  );
}
