import { Action } from "@valkyr/api";
import { InvalidParamsError } from "@valkyr/jsonrpc";

declare module "@valkyr/api" {
  interface ActionContext {
    member: string;
  }
}

export const isAuthenticated: Action<{ realm?: string }> = async function ({ params: { realm } }) {
  if (realm === undefined) {
    return this.reject(new InvalidParamsError(`Missing required 'realm' parameter`));
  }
  // validate membership
  return this.accept();
};

/*
const { realm } = request.params;
    if (realm !== undefined) {
      const member = await this.getRealmMember(realm, payload.id);
      if (member === null) {
        throw Exception.Unauthorized();
      }
      payload.member = member.id;
    }
*/
