abstract class LogEvent {
  readonly startedAt = performance.now();

  endedAt?: number;
  duration?: string;
  data?: Record<string, any>;

  constructor(readonly collection: string, readonly query?: Record<string, any>) {}

  result(data?: Record<string, any>): this {
    this.endedAt = performance.now();
    this.duration = (this.endedAt - this.startedAt).toFixed(2);
    this.data = data;
    return this;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Loggers
 |--------------------------------------------------------------------------------
 */

export class InsertLog extends LogEvent implements DBLogEvent {
  readonly type = "insert" as const;
}

export class UpdateLog extends LogEvent implements DBLogEvent {
  readonly type = "update" as const;
}

export class ReplaceLog extends LogEvent implements DBLogEvent {
  readonly type = "replace" as const;
}

export class RemoveLog extends LogEvent implements DBLogEvent {
  readonly type = "remove" as const;
}

export class QueryLog extends LogEvent implements DBLogEvent {
  readonly type = "query" as const;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type DBLogger = (event: DBLogEvent) => void;

export type DBLogEvent = {
  type: DBLogEventType;
  collection: string;
  startedAt: number;
  endedAt?: number;
  duration?: string;
  message?: string;
};

type DBLogEventType = InsertLog["type"] | UpdateLog["type"] | ReplaceLog["type"] | RemoveLog["type"] | QueryLog["type"];
