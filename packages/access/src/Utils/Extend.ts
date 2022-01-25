/**
 * Extend a target object against the source object.
 *
 * @param source - Object to extend onto.
 * @param target - Object to extend from.
 *
 * @returns extended object
 */
export function extend(source: any, target: any): any {
  const result = { ...source };
  for (const key in target) {
    if (isExtendable(target[key])) {
      result[key] = extend(source[key] || {}, target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

function isExtendable(value: any) {
  if (isObject(value) && isNotArray(value) && isNotDate(value)) {
    return true;
  }
  return false;
}

function isObject(value: any): boolean {
  return typeof value === "object";
}

function isNotArray(value: any): boolean {
  return Array.isArray(value);
}

function isNotDate(value: any): boolean {
  return Object.prototype.toString.call(value) === "[object Date]";
}
