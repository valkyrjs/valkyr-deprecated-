import { Injectable } from "@angular/core";
import { GunSchema, GunUser, IGunUserInstance, ISEAPair } from "gun";

import { auth } from "../Utils";
import { GunAccountService } from "./AccountService";
import { GunService } from "./GunService";

type AccountData = {
  id: string;
} & Record<string, GunSchema>;

@Injectable({ providedIn: "root" })
export class AuthGunService {
  #user: IGunUserInstance<AccountData>;

  #id?: string;

  constructor(readonly gun: GunService, readonly account: GunAccountService) {
    this.#user = this.gun.user().recall({ sessionStorage: true });
  }

  get isAuthenticated(): boolean {
    return this.#user.is !== undefined;
  }

  get id() {
    if (!this.#id) {
      throw new Error("Auth Violation: Id has not been resolved for this instance");
    }
    return this.#id;
  }

  get user(): IGunUserInstance {
    if (!this.isAuthenticated) {
      throw new Error("Auth Violation: Cannot retrieve user for unauthenticated client");
    }
    return this.#user;
  }

  /**
   * Create a new account on the gun network.
   *
   * @param alias    - Alias used to identify user on the gun network.
   * @param password - Passphrase used to authenticate the user on the gun network.
   */
  async create(alias: string, password: string): Promise<void> {
    await this.account.create(alias, password);
  }

  /**
   * Authenticates as user with given alias and password.
   *
   * @param alias    - Alias used to identify user on the gun network.
   * @param password - Passphrase used to authenticate the user on the gun network.
   */
  async authenticate(alias: string, password: string): Promise<void> {
    // const id = await this.account.id(alias);
    // if (!id) {
    //   throw new Error("Auth Violation: User with this alias does not exist");
    // }
    await auth(this.#user, alias, password);
  }

  async resolve(): Promise<void> {
    this.#id = await this.#user.get("alias").then();
  }

  /**
   * Update the password for given alias.
   *
   * @param alias    - Alias to change password for.
   * @param password - Password to change to.
   */
  async password(alias: string, password: string): Promise<void> {
    this.#user.auth(
      alias,
      password,
      (ack: GunAuthAck | GunError) => {
        if (isError(ack)) {
          Promise.reject(ack.err);
        } else {
          Promise.resolve();
        }
      },
      {
        change: "newPassword"
      }
    );
  }

  /**
   * Remove the resolved authentication from the current connection.
   * This is used when you want to remove the credentials without
   * destroying the socket connection.
   */
  async leave() {
    await this.#user.leave();
  }
}

function isError(candidate: Candidate): candidate is GunError {
  return candidate.err !== undefined;
}

type GunCreateAck = {
  pub: string;
};

type GunAuthAck = {
  ack: 2;
  soul: string;
  get: string;
  put: GunUser;
  sea: ISEAPair;
};

type GunOk = {
  ok: any;
};

type GunError = {
  err: string;
};

type Candidate = Partial<GunCreateAck & GunAuthAck & GunOk & GunError>;
