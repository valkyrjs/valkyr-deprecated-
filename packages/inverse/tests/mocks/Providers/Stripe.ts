import { Currency, Payment, PaymentItem } from "../Services/Payments.js";

export class Stripe extends Payment {
  public async create(customerId: string, currency: Currency, amount: number): Promise<PaymentItem> {
    return {
      paymentId: "xyz",
      customerId,
      provider: "stripe",
      status: "created",
      currency,
      amount
    };
  }
}
