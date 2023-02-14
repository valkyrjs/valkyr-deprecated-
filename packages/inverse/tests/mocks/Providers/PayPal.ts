import { Currency, Payment, Payments } from "../Services/Payments";

export class PayPal extends Payments {
  public async create(customerId: string, currency: Currency, amount: number): Promise<Payment> {
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
