import { Controller } from "@valkyr/react";

import { CodeDocument, db } from "~Services/Database";

const name = "container";

export class ContainerController extends Controller<{
  code: CodeDocument;
}> {
  async onInit() {
    await this.#load();
    return {
      code: await this.query(db.collection("code"), { where: { name }, limit: 1 }, "code")
    };
  }

  async #load() {
    const code = await db.collection("code").findOne({ name });
    if (code === undefined) {
      await db.collection("code").insertOne({ name, value: "" });
    }
  }

  onChange(value: string) {
    db.collection("code").updateOne({ name }, { $set: { value } });
  }
}
