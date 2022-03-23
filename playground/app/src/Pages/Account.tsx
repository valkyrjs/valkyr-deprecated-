import React from "react";

import { Account } from "../Models/Account";
import { useAccount } from "../Modules/Account";
import { useAccountForm } from "../Modules/Account/Hooks/UseAccountForm";
import styles from "../Styles/Pages/Home.module.scss";

export function AccountPage() {
  const account = useAccount();

  if (!account) {
    return (
      <div className={styles.container}>
        <h1>Account</h1>
        Loading
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
