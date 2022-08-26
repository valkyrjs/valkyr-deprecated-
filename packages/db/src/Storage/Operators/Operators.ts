import type { RawObject } from "mingo/types";

import type { Document } from "../Storage";

export type Operator<D extends Document = Document> = Insert<D> | Update | Replace<D> | Remove;

/*
 |--------------------------------------------------------------------------------
 | Collection Operators
 |--------------------------------------------------------------------------------
 */

export type Insert<D extends Document = Document> = {
  type: "insert";
  document: D & {
    id?: string;
  };
} & OperatorPromise;

export type Update = {
  type: "update";
  id: string;
  criteria: RawObject;
  operators: UpdateOperators;
} & OperatorPromise;

export type Replace<D extends Document = Document> = {
  type: "replace";
  id: string;
  document: D;
} & OperatorPromise;

export type Remove = {
  type: "remove";
  id: string;
} & OperatorPromise;

/*
 |--------------------------------------------------------------------------------
 | Update Operators
 |--------------------------------------------------------------------------------
 */

export type UpdateOperators = {
  $set?: RawObject;
  $unset?: RawObject;
  $push?: RawObject;
  $pull?: RawObject;
};

/*
 |--------------------------------------------------------------------------------
 | Collection Operators
 |--------------------------------------------------------------------------------
 */

type OperatorPromise<T = any> = {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
};
