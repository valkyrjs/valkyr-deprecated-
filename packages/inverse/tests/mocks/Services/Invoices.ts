export abstract class Invoices {
  public abstract readonly provider: string;

  constructor(public readonly paymentId: string) {}
}
