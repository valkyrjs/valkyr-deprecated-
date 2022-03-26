import { collection } from "../../Collections";
import { isRequestAuthenticated } from "../../Policies/isAuthenticated";
import { route } from "../../Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Root
 |--------------------------------------------------------------------------------
 |
 | Display the version and public status of the API.
 |
 */

route.get("/workspaces", [
  isRequestAuthenticated,
  async function ({ auth }) {
    return this.resolve(
      await collection.workspaces
        .find({
          "members.accountId": auth.auditor
        })
        .toArray()
    );
  }
]);
