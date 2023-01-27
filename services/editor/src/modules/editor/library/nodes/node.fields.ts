import { db } from "~services/database";

export class NodeFields {
  constructor(readonly id: string, readonly key: string) {
    this.name = this.name.bind(this);
    this.add = this.add.bind(this);
    this.setKey = this.setKey.bind(this);
    this.setValue = this.setValue.bind(this);
    this.del = this.del.bind(this);
  }

  name(e: any) {
    db.collection("nodes").updateOne(
      { id: this.id },
      {
        $set: { "data.name": e.target.value }
      }
    );
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
      db.collection("nodes").updateOne(
        { id: this.id },
        {
          $set: {
            [`data.${this.key}[${index}]`]: (data: [string, string]) => [e.target.value, data[1]]
          }
        }
      );
    };
  }

  setValue(index: number) {
    return (value: any) => {
      db.collection("nodes").updateOne(
        { id: this.id },
        {
          $set: {
            [`data.${this.key}[${index}]`]: (data: [string, string]) => [data[0], value]
          }
        }
      );
    };
  }

  del(index: number) {
    return () => {
      db.collection("nodes").updateOne(
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
      );
    };
  }
}
