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
    result[key] = getTargetValue(target[key], source[key]);
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

function getTargetValue(target: any, source: any = {}) {
  if (isExtendable(target)) {
    return extend(source, target);
  }
  return target;
}
