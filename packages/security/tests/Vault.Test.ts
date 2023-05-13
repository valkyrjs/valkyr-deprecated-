import { createVault } from "../src/Vault.js";

describe("Vault", () => {
  it("should encrypt and decrypt a payload", async () => {
    const vault = await createVault();

    const encrypted = await vault.encrypt({ hello: "world" });
    const decrypted = await vault.decrypt(encrypted);

    expect(encrypted).toBeDefined();
    expect(decrypted).toEqual({ hello: "world" });
  });

  it("should fail to decrypt with a different key", async () => {
    const vault1 = await createVault();
    const vault2 = await createVault();

    const encrypted = await vault1.encrypt({ hello: "world" });

    let error;
    try {
      await vault2.decrypt(encrypted);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toBe("decryption operation failed");
  });

  it("should encrypt and decrypt a string", async () => {
    const vault = await createVault();

    const encrypted = await vault.encrypt("hello world");
    const decrypted = await vault.decrypt(encrypted);

    expect(encrypted).toBeDefined();
    expect(decrypted).toBe("hello world");
  });

  it("should encrypt and decrypt an array", async () => {
    const vault = await createVault();

    const encrypted = await vault.encrypt([1, 2, 3]);
    const decrypted = await vault.decrypt(encrypted);

    expect(encrypted).toBeDefined();
    expect(decrypted).toEqual([1, 2, 3]);
  });

  it("should encrypt and decrypt a large payload", async () => {
    const vault = await createVault();

    const largePayload = new Array(10000).fill({ hello: "world" });

    const encrypted = await vault.encrypt(largePayload);
    const decrypted = await vault.decrypt(encrypted);

    expect(encrypted).toBeDefined();
    expect(decrypted).toEqual(largePayload);
  });
});
