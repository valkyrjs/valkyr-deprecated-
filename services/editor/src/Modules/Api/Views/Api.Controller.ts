import { Controller } from "@valkyr/react";

import { CodeDocument, db } from "~Services/Database";

const name = "api";

export class ApiController extends Controller<{
  code: CodeDocument;
}> {
  async onInit() {
    if ((await db.collection("code").findOne({ name })) === undefined) {
      await db.collection("code").insertOne({ name, value: "" });
    }
    return {
      code: await this.query(db.collection("code"), { where: { name }, limit: 1 }, "code")
    };
  }

  onChange(value: string) {
    db.collection("code").updateOne({ name }, { $set: { value } });
  }
}
