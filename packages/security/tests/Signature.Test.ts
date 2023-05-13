import { createSignature, Signature } from "../src/Signature.js";

describe("Signature", () => {
  it("should accept a valid signature", async () => {
    const signature = await createSignature();
    const token = await signature.sign({ hello: "world" });

    expect(token).toBeDefined();

    const { payload } = await signature.verify(token);

    expect(payload).toEqual({ hello: "world" });
  });

  it("should reject invalid signature", async () => {
    const signature1 = await createSignature();
    const signature2 = await createSignature();

    const token = await signature1.sign({ hello: "world" });

    expect(token).toBeDefined();

    await expect(signature2.verify(token)).rejects.toThrow(Signature.JWTInvalidException);
  });

  it("should reject expired token", async () => {
    const signature = await createSignature();
    const expiredToken = await signature.sign(
      { hello: "world" },
      { expiresAt: Math.floor(Date.now() / 1000) - 60 } // 60 seconds in the past
    );

    expect(expiredToken).toBeDefined();

    await expect(signature.verify(expiredToken)).rejects.toThrow(Signature.JWTExpiredException);
  });
});
