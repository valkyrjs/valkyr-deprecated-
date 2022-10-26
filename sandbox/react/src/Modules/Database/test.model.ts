import { Document, Model } from "@valkyr/db";

export type TestDocument = Document & {
  foo: string;
};

export class Test extends Model<TestDocument> {
  readonly foo!: string;
}

export type TestModel = typeof Test;
