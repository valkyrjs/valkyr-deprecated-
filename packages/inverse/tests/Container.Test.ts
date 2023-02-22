import { Container } from "../src/Container.js";
import { token } from "../src/Token.js";
import { Invoice2Go } from "./mocks/Providers/Invoice2Go.js";
import { PayPal } from "./mocks/Providers/PayPal.js";
import { Stripe } from "./mocks/Providers/Stripe.js";
import { Invoice } from "./mocks/Services/Invoice.js";
import { Payment } from "./mocks/Services/Payments.js";

describe("Container", () => {
  it("should register a transient provider", () => {
    const container = new Container([token.transient(Invoice, Invoice2Go)]);

    const invoice = container.get(Invoice, "abc");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a factory provider", () => {
    const container = new Container([
      token.factory("invoice", function invoice(paymentId: string) {
        return new Invoice2Go(paymentId);
      })
    ]);

    const invoice = container.get("invoice", "abc");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a singleton provider", () => {
    const container = new Container([token.singleton(Invoice, new Invoice2Go("abc"))]);

    const invoice = container.get(Invoice);

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a context provider", async () => {
    const container = new Container([
      token.context(Payment, {
        paypal: PayPal,
        stripe: Stripe
      })
    ]);

    const paypal = await container.get(Payment, "paypal").create("xyz", "usd", 100);
    const stripe = await container.get(Payment, "stripe").create("xyz", "jpy", 15000);

    expect(paypal).toStrictEqual({
      paymentId: "xyz",
      customerId: "xyz",
      provider: "paypal",
      status: "created",
      currency: "usd",
      amount: 100
    });

    expect(stripe).toStrictEqual({
      paymentId: "xyz",
      customerId: "xyz",
      provider: "stripe",
      status: "created",
      currency: "jpy",
      amount: 15000
    });
  });
});
