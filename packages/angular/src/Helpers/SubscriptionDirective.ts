import { Directive, Injector, OnDestroy } from "@angular/core";
import { Options, RawObject } from "@valkyr/db";

import { StreamService } from "../Services/Ledger/StreamService";

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

@Directive()
export abstract class SubscriptionDirective implements OnDestroy {
  protected subscription?: Subscription;

  private stream: StreamService;

  constructor(inject: Injector) {
    this.stream = inject.get(StreamService);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public subscribe<T extends Type>(
    model: T,
    options: SubscribeToSingle,
    next: (document: InstanceType<T> | undefined) => void
  ): void;
  public subscribe<T extends Type>(
    model: T,
    options: SubscribeToMany,
    next: (documents: InstanceType<T>[]) => void
  ): void;
  public subscribe<T extends Type>(
    model: T,
    options: SubscriptionOptions,
    next: (documents: InstanceType<T>[] | InstanceType<T> | undefined) => void
  ): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = new Subscription(model, options, next, this.stream);
  }
}

export class Subscription<T extends Type = any> {
  private stream: StreamService;

  private subscribers: { unsubscribe: () => void }[] = [];

  constructor(model: T, options: SubscribeToSingle, next: SingleNextFn<T>, stream: StreamService);
  constructor(model: T, options: SubscribeToMany, next: ManyNextFn<T>, stream: StreamService);
  constructor(model: T, options: SubscriptionOptions, next: NextFn<T>, stream: StreamService) {
    this.stream = stream;

    const queryCriteria = options?.criteria ?? {};
    const queryOptions = getQueryOptions(options ?? {});

    this.subscribers.push((model as any).subscribe(queryCriteria, queryOptions, next));

    if (options?.stream) {
      this.subscribeToStream(model, options.stream, queryCriteria, queryOptions);
    }
  }

  public unsubscribe(): void {
    for (const subscriber of this.subscribers) {
      subscriber.unsubscribe();
    }
  }

  private subscribeToStream(
    model: any,
    { aggregate, endpoint }: StreamSubscriptionOptions,
    criteria: RawObject,
    options: Options
  ) {
    if (endpoint) {
      this.stream.subscribe(aggregate, endpoint).then((subscriber) => {
        this.subscribers.push(subscriber);
      });
    } else {
      model.find(criteria, options).then((documents: any[]) => {
        this.stream
          .subscribe(
            aggregate,
            documents.map((d: any) => d.id),
            endpoint
          )
          .then((subscriber) => {
            this.subscribers.push(subscriber);
          });
      });
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

export type SubscriptionOptions = {
  criteria?: RawObject;
  stream?: StreamSubscriptionOptions;
} & Options;

type StreamSubscriptionOptions = {
  aggregate: string;
  endpoint?: string;
};

export type SubscribeToSingle = SubscriptionOptions & {
  limit: 1;
};

export type SubscribeToMany = SubscriptionOptions & {
  limit?: number;
};

type SingleNextFn<T extends Type> = (document: InstanceType<T> | undefined) => void;
type ManyNextFn<T extends Type> = (documents: InstanceType<T>[]) => void;
type NextFn<T extends Type> = (documents: InstanceType<T>[] | InstanceType<T> | undefined) => void;
