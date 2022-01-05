export function isRelative(url: string): boolean {
  return url.indexOf("http") !== 0 || window.location.host === url.replace("http://", "").replace("https://", "").split("/")[0];
}
