import { Currency, Payment, PaymentItem } from "../Services/Payments.js";

export class PayPal extends Payment {
  public async create(customerId: string, currency: Currency, amount: number): Promise<PaymentItem> {
    return {
      paymentId: "xyz",
      customerId,
      provider: "paypal",
      status: "created",
      currency,
      amount
    };
  }
}
