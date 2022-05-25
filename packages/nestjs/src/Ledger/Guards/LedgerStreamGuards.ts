export const STREAM_GUARD = "StreamGuard";

export abstract class LedgerStreamGuard {
  public abstract canEnter(aggregate: string, streamId: string, auditor?: string): Promise<boolean>;
}
