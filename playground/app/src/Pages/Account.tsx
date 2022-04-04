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
  const [account, loading, error] = useAccount();

  if (loading === true) {
    return (
      <div>
        <h1>Account</h1>
        Loading
      </div>
    );
  }

  if (error !== undefined) {
    return (
      <div>
        <h1>Account</h1>
        {error.message}
      </div>
    );
  }

  if (account === undefined) {
    return <div>Account not found</div>;
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
