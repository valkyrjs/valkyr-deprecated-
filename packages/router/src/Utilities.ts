import { Location } from "history";

/**
 * Check if the two locations has only changed the hash value in the
 * current url path.
 *
 * @param prev - Previous history location.
 * @param next - Next history location.
 *
 * @returns True if the two locations only has hash changes.
 */
export function isHashChange(prev: Location, next: Location): boolean {
  if (prev.pathname !== next.pathname) {
    return false;
  }
  if (prev.search !== next.search) {
    return false;
  }
  if (prev.hash !== next.hash) {
    return true;
  }
  return false;
}
