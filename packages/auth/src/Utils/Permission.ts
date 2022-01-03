import { Permission } from "../Lib/Permission";

/**
 * Default granted permission handler.
 *
 * @remarks
 *
 * This default fallback is used for simple resource actions with a boolean
 * value which always resolved to true.
 */
export function defaultPermissionHandler() {
  return new Permission({ granted: true });
}
