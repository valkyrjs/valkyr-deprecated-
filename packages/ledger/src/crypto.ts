export const crypto = (globalThis as any).crypto ?? eval(`require("crypto")`);
