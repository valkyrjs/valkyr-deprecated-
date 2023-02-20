export const NATIVE_PACKAGES = {
  dns: "node:dns",
  net: "node:net",
  stream: "node:stream",
  tls: "node:tls"
} as const;

export function isNativePackage(name: string): boolean {
  return name in NATIVE_PACKAGES;
}
