import { router } from "@App/Services/Router";

export function isRelative(url: string): boolean {
  return url.indexOf("http") !== 0 || window.location.host === url.replace("http://", "").replace("https://", "").split("/")[0];
}

export function isCurrentRoute(href: string): boolean {
  const { pathname, search } = router.location;
  return `${pathname}${search}` === href;
}

export function isCurrentFuzzyRoute(href: string): boolean {
  return router.location.pathname.includes(href);
}
