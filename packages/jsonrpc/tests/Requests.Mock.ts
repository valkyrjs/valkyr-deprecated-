import { makeNotificationFactory } from "../src/Notification";
import { makeRequestFactory } from "../src/Request";
import { consumer } from "./Consumer.Mock";
import { provider } from "./Provider.Mock";

consumer.methods.set("subtract.positional", async ([a, b]) => {
  return a - b;
});

consumer.methods.set("subtract.named", async ({ subtrahend, minuend }) => {
  return subtrahend - minuend;
});

export const request = {
  subtract: {
    positional: makeRequestFactory<[number, number]>("subtract.positional", provider),
    named: makeRequestFactory<{ subtrahend: number; minuend: number }>("subtract.named", provider)
  },
  update: makeNotificationFactory<number[]>("update", provider),
  foobar: makeRequestFactory("foobar", provider)
};
