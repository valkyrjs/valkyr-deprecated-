import { Vault } from "../src/Vault";

describe("Vault", () => {
  it("should encrypt and decrypt a payload", async () => {
    const vault = await Vault.create();
    const encrypted = await vault.encrypt({ hello: "world" });
    const decrypted = await vault.decrypt(encrypted);

    expect(encrypted).toBeDefined();
    expect(decrypted).toEqual({ hello: "world" });
  });
});
