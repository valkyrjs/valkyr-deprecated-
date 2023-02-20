import { Container, registerContext, registerFactory, registerSingleton, registerTransient } from "../src/Container.js";
import { Invoice2Go } from "./mocks/Providers/Invoice2Go.js";
import { PayPal } from "./mocks/Providers/PayPal.js";
import { Stripe } from "./mocks/Providers/Stripe.js";
import { Payments } from "./mocks/Services/Payments.js";

describe("Container", () => {
  it("should register a transient provider", () => {
    const container = new Container({ invoices: registerTransient("invoices", Invoice2Go) });

    const invoice = container.get("invoices", "abc");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a factory provider", () => {
    const container = new Container({
      invoices: registerFactory("invoices", function getInvoice2Go(paymentId: string) {
        return new Invoice2Go(paymentId);
      })
    });

    const invoice = container.get("invoices", "abc");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a singleton provider", () => {
    const container = new Container({
      invoices: registerSingleton("invoices", new Invoice2Go("abc"))
    });

    const invoice = container.get("invoices");

    expect(invoice).toBeInstanceOf(Invoice2Go);
    expect(invoice.paymentId).toStrictEqual("abc");
  });

  it("should register a context provider", async () => {
    const container = new Container({
      payments: registerContext("payments", Payments, {
        paypal: PayPal,
        stripe: Stripe
      })
    });

    const paypalPayment = await container.get("payments")("paypal").create("xyz", "usd", 100);
    const stripePayment = await container.get("payments")("stripe").create("xyz", "jpy", 15000);

    expect(paypalPayment).toStrictEqual({
      paymentId: "xyz",
      customerId: "xyz",
      provider: "paypal",
      status: "created",
      currency: "usd",
      amount: 100
    });

    expect(stripePayment).toStrictEqual({
      paymentId: "xyz",
      customerId: "xyz",
      provider: "stripe",
      status: "created",
      currency: "jpy",
      amount: 15000
    });
  });
});
