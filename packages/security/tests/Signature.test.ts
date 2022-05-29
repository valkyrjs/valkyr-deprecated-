import { Signature } from "../src/Signature";

describe("Signature", () => {
  it("should accept a valid signature", async () => {
    const signature = await Signature.create();
    const token = await signature.sign({ hello: "world" });
    const publicKey = await signature.exportPublicKey();

    expect(token).toBeDefined();

    const { payload } = await Signature.verify(token, publicKey);

    expect(payload).toEqual({ hello: "world" });
  });

  it("should reject invalid signature", async () => {
    const signature1 = await Signature.create();
    const signature2 = await Signature.create();

    const token = await signature1.sign({ hello: "world" });
    const publicKey = await signature2.exportPublicKey();

    expect(token).toBeDefined();

    await expect(Signature.verify(token, publicKey)).rejects.toThrow("signature verification failed");
  });
});
