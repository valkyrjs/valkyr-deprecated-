import decode from "jwt-decode";
import { Workspace } from "stores";

type Status = "authenticated" | "unauthenticated";

type Data = {
  auditor: Workspace.Auditor;
};

export const auth = {
  set token(jwt: string) {
    localStorage.setItem("token", jwt);
  },

  get token() {
    return localStorage.getItem("token");
  },

  get status(): Status {
    if (this.token === undefined) {
      return "unauthenticated";
    }
    return "authenticated";
  },

  get details(): Data {
    if (auth.is("unauthenticated")) {
      throw new Error(`Auth Violation: Cannot retrieve details for unauthenticated client`);
    }
    return decode<Data>(auth.token);
  },

  get auditor() {
    return auth.details.auditor;
  },

  is(status: Status): boolean {
    return status === auth.status;
  }
};
