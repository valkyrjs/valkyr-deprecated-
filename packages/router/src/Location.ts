import { Location } from "history";

export function isHashChange(prev: Location, next: Location): boolean {
  if (prev.pathname !== next.pathname) {
    return false;
  }
  if (prev.search !== next.search) {
    return false;
  }
  return true;
}
