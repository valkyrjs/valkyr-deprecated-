export function deepCopy(source: any) {
  if (isCopyable(source) === false) {
    return source;
  }
  if (Array.isArray(source) === true) {
    return copyArray(source);
  }
  return copyObject(source);
}

function isCopyable(source: any) {
  return !source || typeof source !== "object" || Object.prototype.toString.call(source) === "[object Date]";
}

function copyObject(source: any) {
  const target: any = {};
  for (const key in source) {
    target[key] = deepCopy(source[key]);
  }
  return target;
}

function copyArray(source: any[]) {
  const target: any[] = [];
  for (let i = 0, len = source.length; i < len; i++) {
    target[i] = deepCopy(source[i]);
  }
  return target;
}
