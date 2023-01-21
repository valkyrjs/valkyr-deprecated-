import { makeNotificationFactory } from "../src/notification";
import { makeRequestFactory } from "../src/request";
import { consumer } from "./consumer.mock";
import { provider } from "./provider.mock";

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
