import { InverseContainer } from "../src/Container.js";
import { inverse } from "../src/Token.js";
import { Invoice2Go } from "./mocks/Providers/Invoice2Go.js";
import { PayPal } from "./mocks/Providers/PayPal.js";
import { Stripe } from "./mocks/Providers/Stripe.js";
import { Payments } from "./mocks/Services/Payments.js";

describe("InverseContainer", () => {
  it("should register a transient provider", () => {
    const container = new InverseContainer([inverse.transient("invoices", Invoice2Go)]);

    const invoice = container.get("invoices", "abc");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a factory provider", () => {
    const container = new InverseContainer([
      inverse.factory("invoices", function getInvoice2Go(paymentId: string) {
        return new Invoice2Go(paymentId);
      })
    ]);

    const invoice = container.get("invoices", "abc");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a singleton provider", () => {
    const container = new InverseContainer([inverse.singleton("invoices", new Invoice2Go("abc"))]);

    const invoice = container.get("invoices");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a context provider", async () => {
    const container = new InverseContainer([
      inverse.context("payments", Payments, {
        paypal: PayPal,
        stripe: Stripe
      })
    ]);

    const paypal = await container.get("payments")("paypal").create("xyz", "usd", 100);
    const stripe = await container.get("payments")("stripe").create("xyz", "jpy", 15000);

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
