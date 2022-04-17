import { BadRequestException, createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export const Auditor = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const [type, token] = request.headers?.authorization?.split(" ") ?? [];

  if (type === undefined) {
    throw new UnauthorizedException();
  }

  if (type !== "Bearer") {
    throw new BadRequestException("Invalid authorization token provided");
  }

  const res = jwt.verify(token, "development");
  if (typeof res === "string") {
    throw new BadRequestException("Token verification failed");
  }
  return res.auditor;
});
