import { Node } from "reactflow";

import { db } from "~Services/Database";

export function setNodePosition(node: Node): void {
  db.collection("nodes")
    .findOne({
      id: node.id,
      position: node.position,
      positionAbsolute: node.positionAbsolute
    })
    .then((document) => {
      if (document === undefined) {
        db.collection("nodes").updateOne(
          {
            id: node.id
          },
          {
            $set: {
              position: node.position,
              positionAbsolute: node.positionAbsolute
            }
          }
        );
      }
    });
}
