export class UpdateOneException {
  constructor(readonly matched: boolean, readonly exception: Error) {}
}
