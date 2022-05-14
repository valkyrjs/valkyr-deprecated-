import { encrypt, KeyLike } from "@valkyr/security";

type RecordLike = Record<string, unknown>;

type Props<Profile extends RecordLike = any> = {
  cid: string;
  profile: Profile;
  private: string[];
  publicKey: KeyLike;
};

export class UserIdentity<Profile extends RecordLike = any> {
  readonly cid: string;
  readonly profile: Profile;
  readonly private: string[];

  #publicKey: KeyLike;

  constructor(props: Props) {
    this.cid = props.cid;
    this.profile = props.profile;
    this.private = props.private;
    this.#publicKey = props.publicKey;
  }

  get publicKey(): KeyLike {
    return this.#publicKey;
  }

  async encrypt<T extends Record<string, unknown>>(obj: T): Promise<string> {
    return encrypt(obj, this.publicKey);
  }
}
