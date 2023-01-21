import { ErrorResponse, Id, Notification, Params, SuccessResponse } from "@valkyr/jsonrpc";
import { Subject } from "rxjs";

const subject = new Subject<MessageData>();
const pending = new Map<Id, Function>();

export const messages = {
  set: pending.set.bind(pending),
  next: subject.next.bind(subject)
};

subject.subscribe((message) => {
  if ("id" in message) {
    const resolve = pending.get(message.id);
    if (resolve !== undefined) {
      pending.delete(message.id);
      resolve(message);
    }
  }
});

type MessageData<Result = unknown> = SuccessResponse<Result> | ErrorResponse | Notification<Params>;
