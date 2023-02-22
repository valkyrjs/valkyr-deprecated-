export abstract class Payment {
  abstract create(customerId: string, currency: Currency, amount: number): Promise<PaymentItem>;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type PaymentItem = {
  paymentId: string;
  customerId: string;
  provider: string;
  status: Status;
  currency: Currency;
  amount: number;
};

export type Status = "created" | "processing" | "failed" | "processed";

export type Currency = "usd" | "eur" | "jpy";
