export abstract class Invoices {
  abstract readonly provider: string;

  constructor(readonly paymentId: string) {}
}
