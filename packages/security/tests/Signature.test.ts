import { Signature } from "../src/Signature";

describe("Token", () => {
  it("should sign and verify a token", async () => {
    const signature = await Signature.create();
    const token = await signature.sign({ hello: "world" });
    const publicKey = await signature.exportPublicKey();

    expect(token).toBeDefined();

    const { payload } = await Signature.verify(token, publicKey);

    expect(payload).toEqual({ hello: "world" });
  });
});
