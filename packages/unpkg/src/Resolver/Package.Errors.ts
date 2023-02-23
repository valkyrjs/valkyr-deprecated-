export class PackageNoTypeError extends Error {
  constructor(name: string) {
    super(`Package Exception: Package ${name} does not have a types field.`);
  }
}
