import type { Document } from "../../../Types.js";

export function getInsertManyResult(documents: Document[]): InsertManyResult {
  return {
    acknowledged: true,
    insertedCount: documents.length,
    insertedIds: documents.reduce<{ [key: number]: string | number }>((map, document, index) => {
      map[index] = document.id;
      return map;
    }, {})
  };
}

export function getInsertOneResult(document: Document): InsertOneResult {
  return {
    acknowledged: true,
    insertedId: document.id
  };
}

export type InsertManyResult =
  | {
      acknowledged: false;
    }
  | {
      acknowledged: true;
      insertedCount: number;
      insertedIds: {
        [key: number]: string | number;
      };
    };

export type InsertOneResult =
  | {
      acknowledged: false;
    }
  | {
      acknowledged: true;
      insertedId: string | number;
    };
