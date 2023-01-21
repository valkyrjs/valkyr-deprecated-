import { NodeChange, NodePositionChange } from "reactflow";

import { db } from "~services/database";

type NodeChangeQueue = {
  [id: string]: {
    [type: string]: NodeChange;
  };
};

export class NodeManager {
  #timeout: any;
  #changes: NodeChangeQueue = {};

  constructor() {
    this.commit = this.commit.bind(this);
  }

  addNodeChanges(changes: NodeChange[]): void {
    for (const change of changes) {
      switch (change.type) {
        case "position": {
          this.position(change);
          break;
        }
      }
    }
    clearTimeout(this.#timeout);
    this.#timeout = setTimeout(this.commit, 1000);
  }

  position(change: NodePositionChange): void {
    if (change.position === undefined || change.positionAbsolute === undefined) {
      return;
    }
    this.#changes[change.id] = {
      ...(this.#changes[change.id] ?? {}),
      position: change
    };
  }

  commit(): void {
    const changes = JSON.parse(JSON.stringify(this.#changes));
    this.#changes = {};
    for (const id in changes) {
      const $set: any = {};
      for (const type in changes[id]) {
        switch (type) {
          case "position": {
            $set.position = changes[id][type].position;
            $set.positionAbsolute = changes[id][type].positionAbsolute;
          }
        }
      }
      db.collection("nodes").updateOne({ id }, { $set });
    }
  }
}
