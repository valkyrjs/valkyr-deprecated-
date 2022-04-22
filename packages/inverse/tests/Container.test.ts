import { Container, MissingChildContainerError, MissingDependencyError } from "../src";
import { Invoice2Go } from "./mocks/Providers/Invoice2Go";
import { PayPal } from "./mocks/Providers/PayPal";
import { Stripe } from "./mocks/Providers/Stripe";
import { Invoices } from "./mocks/Services/Invoices";
import { Payments } from "./mocks/Services/Payments";

type Context = {
  provider: string;
};

type Tokens = {
  invoices: typeof Invoices;
  payments: Payments;
};

const isProvider = (provider: string) => (context: Context) => provider === context.provider;

describe("Container", () => {
  describe("when .where method is used", () => {
    const paypal: Context = { provider: "paypal" };
    const stripe: Context = { provider: "stripe" };

    let container: Container<Tokens, Context>;

    beforeEach(() => {
      container = new Container<Tokens, Context>();
      container.createContext(paypal);
      container.createContext(stripe);
    });

    it("should add a sub container when argument is a context object", () => {
      expect(container.contexts.get(paypal)).toBeDefined();
      expect(container.contexts.get(stripe)).toBeDefined();
      expect(container.contexts.get({ provider: "skrill" })).toBeUndefined();
    });

    it("should set a sub container dependency when a filter method is provided", async () => {
      container.where(isProvider("paypal")).set("payments", new PayPal());
      container.where(isProvider("stripe")).set("payments", new Stripe());

      await expect(
        container.where(isProvider("paypal")).get("payments").create("xyz", "usd", 100)
      ).resolves.toMatchObject({
        customerId: "xyz",
        provider: "paypal",
        currency: "usd",
        amount: 100
      });

      await expect(
        container.where(isProvider("stripe")).get("payments").create("xyz", "jpy", 15000)
      ).resolves.toMatchObject({
        customerId: "xyz",
        provider: "stripe",
        currency: "jpy",
        amount: 15000
      });
    });

    it("should throw error when sub container does not exist", () => {
      expect(() => container.where(isProvider("skrill"))).toThrow(new MissingChildContainerError());
    });

    it("should throw error when sub container does not have a registered dependency", () => {
      expect(() => container.where(isProvider("paypal")).get("payments")).toThrow(
        new MissingDependencyError("payments")
      );
    });
  });

  describe("when .has() method is used", () => {
    const container = new Container<Tokens>();

    beforeAll(() => {
      container.set("payments", new PayPal());
    });

    it("should return true for registered dependencies", () => {
      expect(container.has("payments")).toBeTruthy();
    });

    it("should return false for unregistered dependencies", () => {
      expect(container.has("invoices")).toBeFalsy();
    });
  });

  describe("when .set() method is used", () => {
    const container = new Container<Tokens>();

    it("should set new dependency", () => {
      expect(container.set("payments", new PayPal()).has("payments")).toBeTruthy();
    });
  });

  describe("when .get() method is used", () => {
    const container = new Container<Tokens>();

    beforeAll(() => {
      container.set("payments", new Stripe());
      container.set("invoices", Invoice2Go);
    });

    it("should resolve correct warrior instances", () => {
      expect(container.get("payments")).toBeInstanceOf(Stripe);
      expect(container.get("invoices", "xyz")).toBeInstanceOf(Invoice2Go);
    });

    it("should resolve correct fight results", async () => {
      return expect(container.get("payments").create("xyz", "usd", 100)).resolves.toMatchObject({
        provider: "stripe",
        currency: "usd",
        amount: 100
      });
    });

    it("should resolve a transient provider with correct arguments", () => {
      expect(container.get("invoices", "xyz").provider).toEqual("Invoice2Go");
    });
  });
});
