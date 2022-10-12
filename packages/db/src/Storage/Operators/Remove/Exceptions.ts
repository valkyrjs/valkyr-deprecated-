export class RemoveOneException {
  readonly acknowledged = false;

  constructor(readonly exception: Error) {}
}
