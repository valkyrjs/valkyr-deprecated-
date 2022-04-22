import * as NotationDefault from "notation";

import { Config, CONFIG_DATA_METADATA } from "../Decorators/Config";
import { Injectable } from "../Decorators/Injectable";

const notate = NotationDefault.Notation.create;

@Injectable()
@Config()
export class ConfigService {
  public static set(path: string, value: any) {
    const current = Reflect.getMetadata(CONFIG_DATA_METADATA, this) ?? {};
    Reflect.defineMetadata(CONFIG_DATA_METADATA, notate(current).set(path, value).value, this);
    return this;
  }

  public static get(path: string, defaultValue?: any) {
    const current = Reflect.getMetadata(CONFIG_DATA_METADATA, this) ?? {};
    return notate(current).get(path, defaultValue);
  }

  public set(path: string, value: any) {
    const current = Reflect.getMetadata(CONFIG_DATA_METADATA, this.constructor) ?? {};
    Reflect.defineMetadata(CONFIG_DATA_METADATA, notate(current).set(path, value).value, this.constructor);
    return this;
  }

  public get(path: string, defaultValue?: any) {
    const current = Reflect.getMetadata(CONFIG_DATA_METADATA, this.constructor) ?? {};
    return notate(current).get(path, defaultValue);
  }
}
