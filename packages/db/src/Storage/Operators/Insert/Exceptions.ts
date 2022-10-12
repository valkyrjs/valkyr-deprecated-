export class InsertException {
  readonly acknowledged = false;

  constructor(readonly exception: Error) {}
}
