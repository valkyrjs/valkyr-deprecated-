import { Collections, db } from "~Services/Database";
import { toType } from "~Services/Types";

/*
 |--------------------------------------------------------------------------------
 | BlockFields
 |--------------------------------------------------------------------------------
 */

export class BlockFields {
  constructor(readonly collection: keyof Collections, readonly id: string, readonly key: string) {
    this.addField = this.addField.bind(this);
    this.setFieldKey = this.setFieldKey.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
    this.removeField = this.removeField.bind(this);
  }

  addField() {
    db.collection(this.collection).updateOne(
      {
        id: this.id
      },
      {
        $push: {
          [this.key]: ["", "p:string"]
        }
      }
    );
  }

  setFieldKey(index: number) {
    return (e: any) => {
      db.collection(this.collection).updateOne(
        { id: this.id },
        {
          $set: {
            [`${this.key}[${index}]`]: (data: [string, string]) => [e.target.value, data[1]]
          }
        }
      );
    };
  }

  setFieldValue(index: number) {
    return (value: any) => {
      db.collection(this.collection).updateOne(
        { id: this.id },
        {
          $set: {
            [`${this.key}[${index}]`]: (data: [string, string]) => [data[0], value]
          }
        }
      );
    };
  }

  removeField(index: number) {
    return () => {
      db.collection(this.collection).updateOne(
        {
          id: this.id
        },
        {
          $set: {
            [this.key]: (data: any[]) =>
              data.reduce((list, _, i) => {
                if (i !== index) {
                  list.push(data[i]);
                }
                return list;
              }, [])
          }
        }
      );
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getFieldsType(name: string, fields: BlockField[]): string {
  return `type ${name} = {${getFields(fields)}};`;
}

export function getFieldsInterface(name: string, fields: BlockField[]): string {
  return `interface ${name} {${getFields(fields)}};`;
}

export function getFields(fields: BlockField[]): string {
  return getFieldsArray(fields).join("\n");
}

export function getFieldsArray(fields: BlockField[]): string[] {
  const result = [];
  for (const [key, type] of fields) {
    if (key === "") {
      continue; // do not add empty keys
    }
    result.push(`${key}:${toType(type)};`);
  }
  return result;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type BlockField = [string, string];
