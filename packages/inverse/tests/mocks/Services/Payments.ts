export abstract class Payments {
  abstract create(customerId: string, currency: Currency, amount: number): Promise<Payment>;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Payment = {
  paymentId: string;
  customerId: string;
  provider: string;
  status: Status;
  currency: Currency;
  amount: number;
};

export type Status = "created" | "processing" | "failed" | "processed";

export type Currency = "usd" | "eur" | "jpy";
