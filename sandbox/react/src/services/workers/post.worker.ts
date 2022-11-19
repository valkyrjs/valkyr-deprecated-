import { faker } from "@faker-js/faker";
import { Worker } from "@valkyr/queue";

export class PostRequestWorker extends Worker<PostRequestPayload> {
  readonly type = "post" as const;
  readonly retryLimit = 2;

  async process(_: string, payload: PostRequestPayload) {
    await new Promise((resolve) => setTimeout(resolve, getRandomNumber(1000, 5000)));
    if (Math.random() > 0.5) {
      return this.error("Failed to process post request", {
        ...payload,
        body: {
          name: faker.name.firstName()
        }
      });
    }
    return this.success();
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

type PostRequestPayload = {
  url: string;
  body: any;
};
