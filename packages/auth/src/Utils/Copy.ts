export function deepCopy(source: any) {
  let target: any;

  // ### Object Check
  // If the source is not an array or object or is a date we return the source value as is.

  if (!source || typeof source !== "object" || Object.prototype.toString.call(source) === "[object Date]") {
    return source;
  }

  // ### Array
  // If the source is an array we create a new array and deep copy each entry.

  if (Array.isArray(source)) {
    target = [];
    for (let i = 0, len = source.length; i < len; i++) {
      target[i] = deepCopy(source[i]);
    }
    return target;
  }

  // ### Object
  // If source is a plain object we create a new object and deep copy each key.

  target = {};
  for (const key in source) {
    target[key] = deepCopy(source[key]);
  }
  return target;
}
