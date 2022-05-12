import { GunValueSimple, IGunChain, IGunUserInstance } from "gun";

export type GunError = {
  err: string;
};

export type GunResponse = any;

export async function put<T extends IGunChain<any, any, any>>(chain: T, value: GunValueSimple): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    chain.put(value, (res: GunResponse) => {
      if (isError(res)) {
        reject(res.err);
      } else {
        resolve(res);
      }
    });
  });
}

export async function create<T extends IGunUserInstance>(user: T, alias: string, password: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    user.create(alias, password, (res: GunResponse) => {
      if (isError(res)) {
        reject(res.err);
      } else {
        resolve(res);
      }
    });
  });
}

export async function auth<T extends IGunUserInstance>(user: T, alias: string, password: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    user.auth(alias, password, (res: GunResponse) => {
      if (isError(res)) {
        reject(res.err);
      } else {
        resolve(res);
      }
    });
  });
}

export function isError(res: GunResponse): res is GunError {
  return res.err !== undefined;
}
