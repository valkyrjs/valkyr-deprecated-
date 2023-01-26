import { Node } from "reactflow";

import { db } from "~services/database";

export class NodeFields<T> {
  constructor(readonly id: string, readonly key: string, readonly onCache: (node: Node<T>) => void) {
    this.name = this.name.bind(this);
    this.add = this.add.bind(this);
    this.setKey = this.setKey.bind(this);
    this.setValue = this.setValue.bind(this);
    this.del = this.del.bind(this);
    this.cache = this.cache.bind(this);
  }

  name(e: any) {
    db.collection("nodes")
      .updateOne(
        { id: this.id },
        {
          $set: { "data.name": e.target.value }
        }
      )
      .then(this.cache);
  }

  add() {
    db.collection("nodes").updateOne(
      {
        id: this.id
      },
      {
        $push: {
          [`data.${this.key}`]: ["", "p:string"]
        }
      }
    );
  }

  setKey(index: number) {
    return (e: any) => {
      db.collection("nodes")
        .updateOne(
          { id: this.id },
          {
            $set: {
              [`data.${this.key}[${index}]`]: (data: [string, string]) => [e.target.value, data[1]]
            }
          }
        )
        .then(this.cache);
    };
  }

  setValue(index: number) {
    return (value: any) => {
      db.collection("nodes")
        .updateOne(
          { id: this.id },
          {
            $set: {
              [`data.${this.key}[${index}]`]: (data: [string, string]) => [data[0], value]
            }
          }
        )
        .then(this.cache);
    };
  }

  del(index: number) {
    return () => {
      db.collection("nodes")
        .updateOne(
          {
            id: this.id
          },
          {
            $set: {
              [`data.${this.key}`]: (data: any[]) =>
                data.reduce((list, _, i) => {
                  if (i !== index) {
                    list.push(data[i]);
                  }
                  return list;
                }, [])
            }
          }
        )
        .then(this.cache);
    };
  }

  async cache() {
    const node = await db.collection("nodes").findById(this.id);
    if (node !== undefined) {
      db.collection("nodes").updateOne(
        { id: node.id },
        {
          $set: {
            "data.cache": this.onCache(node)
          }
        }
      );
    }
  }
}
