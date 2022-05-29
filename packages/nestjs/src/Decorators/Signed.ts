import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export type IdentitySignature = {
  auditor: string;
  token: string;
};

export const Signed = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request.auditor === undefined || request.token === undefined) {
    throw new UnauthorizedException();
  }
  return {
    auditor: request.auditor,
    token: request.token
  };
});
