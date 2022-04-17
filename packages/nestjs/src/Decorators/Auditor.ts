import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export const Auditor = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const [type, token] = request.headers?.authorization?.split(" ") ?? [];

  if (type === "Bearer") {
    const res = jwt.verify(token, "development");
    if (typeof res !== "string") {
      return res.auditor;
    }
  }

  return "";
});
