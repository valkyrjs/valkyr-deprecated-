import { db } from "~services/database";
import { format } from "~services/prettier";

export function addTypeNode(): void {
  db.collection("nodes").insertOne({
    type: "type",
    position: { x: 0, y: 0 },
    dragHandle: ".node-drag-handle",
    data: {
      type: "type",
      config: {
        name: "Foo",
        data: {}
      },
      monaco: {
        model: format(`
          type Foo = {};
        `)
      }
    }
  });
}

export type TypeNodeData = {
  type: "type";
  config: {
    name: string;
    data: {
      [key: string]: string;
    };
  };
  monaco: {
    model: string;
  };
};
