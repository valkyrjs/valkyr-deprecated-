import { Dimensions } from "reactflow";

import { db } from "~Services/Database";

let debounce: any;

let pending: {
  [id: string]: Dimensions;
} = {};

export async function setNodeDimensions(id: string, dimensions: Dimensions): Promise<void> {
  clearTimeout(debounce);
  pending[id] = dimensions;
  debounce = setTimeout(commit, 1000);
}

function commit() {
  const changes = getPending();
  resetPending();
  for (const id in changes) {
    const { width, height } = changes[id];
    db.collection("nodes")
      .findOne({ id, height, width })
      .then((node) => {
        if (node === undefined) {
          db.collection("nodes").updateOne({ id }, { $set: { width, height } });
        }
      });
  }
}

function getPending() {
  return JSON.parse(JSON.stringify(pending));
}

function resetPending() {
  pending = {};
}
