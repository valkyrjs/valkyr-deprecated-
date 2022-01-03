import { URL } from "url";

export function getPathname(req: any): string {
  return new URL(req.url, req.protocol + "://" + req.headers.host + "/").pathname;
}
