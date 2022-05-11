import { Options, RawObject } from "@valkyr/db";

import { StreamService } from "../Ledger/StreamService";

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export abstract class DataSubscriber {
  abstract readonly subscriber: DataSubscriberService<any>;

  get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  get unsubscribe() {
    return this.subscriber.unsubscribe.bind(this.subscriber);
  }
}

export abstract class DataSubscriberService<T extends Type> {
  abstract readonly stream: StreamService;
  abstract readonly model: T;

  #subscriptions = new Map<any, Subscription<T>[]>();

  subscribe(ctx: any, options: SubscribeToSingle, next: SingleNextFn<T>): void;
  subscribe(ctx: any, options: SubscribeToMany, next: ManyNextFn<T>): void;
  subscribe(ctx: any, options: SubscriptionOptions, next: SingleNextFn<T> | ManyNextFn<T>): void {
    const subscription = new Subscription<T>(this.model, options, next, this.stream);
    const subscriptions = this.#subscriptions.get(ctx);
    if (subscriptions) {
      subscriptions.push(subscription);
    } else {
      this.#subscriptions.set(ctx, [subscription]);
    }
  }

  unsubscribe(ctx: any) {
    for (const subscription of this.#subscriptions.get(ctx) ?? []) {
      subscription.unsubscribe();
    }
  }
}

class Subscription<T extends Type> {
  readonly #stream: StreamService;
  readonly #subscribers: { unsubscribe: () => void }[] = [];

  constructor(model: T, options: SubscriptionOptions, next: SingleNextFn<T> | ManyNextFn<T>, stream: StreamService) {
    this.#stream = stream;

    const queryCriteria = options?.criteria ?? {};
    const queryOptions = getQueryOptions(options ?? {});

    this.#subscribers.push((model as any).subscribe(queryCriteria, queryOptions, next));

    if (options?.stream) {
      this.#subscribeToStream(model, options.stream, queryCriteria, queryOptions);
    }
  }

  unsubscribe(): void {
    for (const subscriber of this.#subscribers) {
      subscriber.unsubscribe();
    }
  }

  #subscribeToStream(
    model: any,
    { aggregate, streamIds, endpoint }: StreamSubscriptionOptions,
    criteria: RawObject,
    options: Options
  ) {
    if (aggregate) {
      if (endpoint) {
        this.#stream.subscribe(aggregate, endpoint).then((subscriber) => {
          this.#subscribers.push(subscriber);
        });
      } else if (streamIds) {
        this.#stream.subscribe(aggregate, streamIds).then((subscriber) => {
          this.#subscribers.push(subscriber);
        });
      } else {
        model.find(criteria, options).then((documents: any[]) => {
          this.#stream
            .subscribe(
              aggregate,
              documents.map((d: any) => d.id),
              endpoint
            )
            .then((subscriber) => {
              this.#subscribers.push(subscriber);
            });
        });
      }
    }
  }
}

function getQueryOptions({ sort, skip, limit }: Options): Options {
  const options: Options = {};
  if (sort) {
    options.sort = sort;
  }
  if (skip !== undefined) {
    options.skip = skip;
  }
  if (limit !== undefined) {
    options.limit = limit;
  }
  return options;
}

type SingleNextFn<T extends Type> = (document: InstanceType<T> | undefined) => void;
type ManyNextFn<T extends Type> = (documents: InstanceType<T>[]) => void;
type NextFn<T extends Type> = (documents: InstanceType<T>[] | InstanceType<T> | undefined) => void;

type SubscribeToSingle = SubscriptionOptions & {
  limit: 1;
};

type SubscribeToMany = SubscriptionOptions & {
  limit?: number;
};

type SubscriptionOptions = {
  criteria?: RawObject;
  stream?: StreamSubscriptionOptions;
} & Options;

type StreamSubscriptionOptions =
  | {
      aggregate: string;
      endpoint: string;
      streamIds?: undefined;
    }
  | {
      aggregate: string;
      streamIds: string[];
      endpoint?: undefined;
    };
