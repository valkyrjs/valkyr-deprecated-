import type { Accepted, Redirect, RedirectType, Rejected, Resolved } from "../Types/Action";

export function reject(code: number, message: string, data = {}): Rejected {
  return {
    status: "rejected",
    code,
    message,
    data
  };
}

export function redirect(url: string, type: RedirectType = "PERMANENT"): Redirect {
  return {
    status: "redirect",
    type,
    url
  };
}

export function accept(): Accepted {
  return {
    status: "accepted"
  };
}

export function resolve(data?: any): Resolved {
  return {
    status: "resolved",
    code: data !== undefined ? 200 : 204,
    data
  };
}
