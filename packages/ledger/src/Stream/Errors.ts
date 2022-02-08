export class StreamNotFoundError extends Error {
  public readonly type = "StreamNotFoundError";

  constructor(streamId: string) {
    super(`Stream Violation: Cannot append incoming descriptor, stream ${streamId} does not exist`);
  }
}
