import { Collection, Document, MemoryAdapter } from "../../src";
import { Model } from "../../src";

export type Attributes = Document & {
  name: string;
  email: string;
};

export class User extends Model<Attributes> {
  public static readonly $collection = new Collection<Attributes>("users", new MemoryAdapter());

  public readonly name: Attributes["name"];
  public readonly email: Attributes["email"];

  constructor(document: Attributes) {
    super(document);

    this.name = document.name;
    this.email = document.email;

    Object.freeze(this);
  }

  public toJSON(): Attributes {
    return super.toJSON({
      name: this.name,
      email: this.email
    });
  }
}
