import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from "@nestjs/common";
import { validate } from "class-validator";

/*
 |--------------------------------------------------------------------------------
 | Data Transfer Object
 |--------------------------------------------------------------------------------
 */

export class DataTransferObject<D = unknown> {
  constructor(data: D) {
    for (const key in data) {
      (this as any)[key] = data[key];
    }
  }

  static async validate<D, T extends DataTransferObject<D>>(this: DataTransferObjectClass<T, D>, data: D): Promise<T> {
    const dto = new this(data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException({ errors });
    }
    return dto;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Decorator
 |--------------------------------------------------------------------------------
 */

export const Dto = createParamDecorator(dataTransferObjectFactory);

async function dataTransferObjectFactory(dataTransferObject: DataTransferObjectClass, ctx: ExecutionContext) {
  if (dataTransferObject === undefined) {
    throw new InternalServerErrorException("DataTransferObject class must be provided");
  }
  const { body } = ctx.switchToHttp().getRequest();
  if (body === undefined) {
    throw new BadRequestException("Request does not have a valid body");
  }
  return dataTransferObject.validate(body);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type DataTransferObjectClass<T = unknown, D = unknown> = {
  new (document: D): T;
  validate(data: D): Promise<T>;
};
