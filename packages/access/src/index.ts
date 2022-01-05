export { Access } from "./Access";
export { Attributes, createAllFilter } from "./Attributes";
export { container } from "./Container";
export { Permission, Query } from "./Permission";
export { Operation, Role, RoleData } from "./Role";
export type { Database } from "./Services";

export function extend(source: any, target: any): any {
  for (const key in target) {
    if (
      typeof target[key] === "object" &&
      !Array.isArray(target[key]) &&
      Object.prototype.toString.call(target[key]) !== "[object Date]"
    ) {
      source[key] = extend(source[key] || {}, target[key]);
    } else {
      source[key] = target[key];
    }
  }
  return source;
}
