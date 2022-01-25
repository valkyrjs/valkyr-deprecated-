import { Attributes } from "../../../src/Attributes";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const ACCOUNT_FLAGS = {
  name: 1 << 0,
  password: 1 << 1
};

const ACCOUNT_FILTERS = {
  owner: ACCOUNT_FLAGS.name | ACCOUNT_FLAGS.password,
  public: ACCOUNT_FLAGS.name
};

/*
 |--------------------------------------------------------------------------------
 | Access Profile
 |--------------------------------------------------------------------------------
 */

export function getAccountAttributes() {
  return new Attributes(ACCOUNT_FLAGS, ACCOUNT_FILTERS);
}
