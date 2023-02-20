export function toType(config: string): string {
  if (typeof config === "object" || Array.isArray(config)) {
    return "unknown";
  }
  const [origin, type, value] = config.split(":");
  switch (origin) {
    case "p": {
      return toPrimitiveType(type, value);
    }
    case "t": {
      return toCustomType(type);
    }
    default: {
      throw new Error(`Unknown type origin: ${origin}`);
    }
  }
}

function toPrimitiveType(type: string, value?: string): string {
  switch (type) {
    case "string": {
      if (value !== undefined) {
        return `"${value}"`;
      }
      return type;
    }
    case "number":
    case "boolean": {
      if (value !== undefined) {
        return value;
      }
      return type;
    }
    default: {
      throw new Error(`Unknown primitive type: ${type}`);
    }
  }
}

function toCustomType(type: string): string {
  return `Type.${type}`;
}
