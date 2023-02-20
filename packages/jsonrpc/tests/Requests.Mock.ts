import { makeNotificationFactory } from "../src/Notification.js";
import { makeRequestFactory } from "../src/Request.js";
import { consumer } from "./Consumer.Mock.js";
import { provider } from "./Provider.Mock.js";

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
