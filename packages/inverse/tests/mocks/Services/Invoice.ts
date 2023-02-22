export abstract class Invoice {
  abstract readonly provider: string;

  constructor(readonly paymentId: string) {}
}
