import type { BSONRegExp, BSONType } from "bson";

export type Document = {
  [key: string]: any;
};

export type WithId<TSchema> = {
  id: string;
} & TSchema;

export type Filter<TSchema> = {
  [P in keyof TSchema]?: Condition<TSchema[P]>;
} & RootFilterOperators<TSchema> &
  Record<string, any>;

export type UpdateFilter<TSchema> = {
  $inc?: OnlyFieldsOfType<TSchema, number>;
  $set?: MatchKeysAndValues<TSchema> | MatchKeysToFunctionValues<TSchema> | Record<string, any>;
  $unset?: OnlyFieldsOfType<TSchema, any, "" | true | 1>;
  $pull?: PullOperator<TSchema>;
  $push?: PushOperator<TSchema>;
};

type RootFilterOperators<TSchema> = {
  $and?: Filter<TSchema>[];
  $nor?: Filter<TSchema>[];
  $or?: Filter<TSchema>[];
  $text?: {
    $search: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacriticSensitive?: boolean;
  };
  $where?: string | ((this: TSchema) => boolean);
  $comment?: string | Document;
};

type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>;

type AlternativeType<T> = T extends ReadonlyArray<infer U> ? T | RegExpOrString<U> : RegExpOrString<T>;

type RegExpOrString<T> = T extends string ? BSONRegExp | RegExp | T : T;

type FilterOperators<TValue> = {
  $eq?: TValue;
  $gt?: TValue;
  $gte?: TValue;
  $in?: ReadonlyArray<TValue>;
  $lt?: TValue;
  $lte?: TValue;
  $ne?: TValue;
  $nin?: ReadonlyArray<TValue>;
  $not?: TValue extends string ? FilterOperators<TValue> | RegExp : FilterOperators<TValue>;
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean;
  $type?: BSONType | BSONTypeAlias;
  $expr?: Record<string, any>;
  $jsonSchema?: Record<string, any>;
  $mod?: TValue extends number ? [number, number] : never;
  $regex?: TValue extends string ? RegExp | string : never;
  $options?: TValue extends string ? string : never;
  $geoIntersects?: {
    $geometry: Document;
  };
  $geoWithin?: Document;
  $near?: Document;
  $nearSphere?: Document;
  $maxDistance?: number;
  $all?: ReadonlyArray<any>;
  $elemMatch?: Document;
  $size?: TValue extends ReadonlyArray<any> ? number : never;
  $bitsAllClear?: BitwiseFilter;
  $bitsAllSet?: BitwiseFilter;
  $bitsAnyClear?: BitwiseFilter;
  $bitsAnySet?: BitwiseFilter;
  $rand?: Record<string, never>;
};

type BSONTypeAlias = keyof typeof BSONType;

type BitwiseFilter = number | ReadonlyArray<number>;

type OnlyFieldsOfType<TSchema, FieldType = any, AssignableType = FieldType> = IsAny<
  TSchema[keyof TSchema],
  Record<string, FieldType>,
  AcceptedFields<TSchema, FieldType, AssignableType> &
    NotAcceptedFields<TSchema, FieldType> &
    Record<string, AssignableType>
>;

type MatchKeysAndValues<TSchema> = Readonly<Partial<TSchema>>;

type MatchKeysToFunctionValues<TSchema> = {
  readonly [key in keyof TSchema]?: (this: TSchema, value: TSchema[key]) => TSchema[key];
};

type PullOperator<TSchema> = ({
  readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?:
    | Partial<Flatten<TSchema[key]>>
    | FilterOperations<Flatten<TSchema[key]>>;
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
  readonly [key: string]: FilterOperators<any> | any;
};

type PushOperator<TSchema> = ({
  readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?:
    | Flatten<TSchema[key]>
    | ArrayOperator<Array<Flatten<TSchema[key]>>>;
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
  readonly [key: string]: ArrayOperator<any> | any;
};

type KeysOfAType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? key : never;
}[keyof TSchema];

type AcceptedFields<TSchema, FieldType, AssignableType> = {
  readonly [key in KeysOfAType<TSchema, FieldType>]?: AssignableType;
};

type NotAcceptedFields<TSchema, FieldType> = {
  readonly [key in KeysOfOtherType<TSchema, FieldType>]?: never;
};

type Flatten<Type> = Type extends ReadonlyArray<infer Item> ? Item : Type;

type IsAny<Type, ResultIfAny, ResultIfNotAny> = true extends false & Type ? ResultIfAny : ResultIfNotAny;

type FilterOperations<T> = T extends Record<string, any>
  ? {
      [key in keyof T]?: FilterOperators<T[key]>;
    }
  : FilterOperators<T>;

type ArrayOperator<Type> = {
  $each?: Array<Flatten<Type>>;
  $slice?: number;
  $position?: number;
  $sort?: Sort;
};

type Sort =
  | string
  | Exclude<
      SortDirection,
      {
        $meta: string;
      }
    >
  | string[]
  | {
      [key: string]: SortDirection;
    }
  | Map<string, SortDirection>
  | [string, SortDirection][]
  | [string, SortDirection];

type SortDirection =
  | 1
  | -1
  | "asc"
  | "desc"
  | "ascending"
  | "descending"
  | {
      $meta: string;
    };

type KeysOfOtherType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? never : key;
}[keyof TSchema];
