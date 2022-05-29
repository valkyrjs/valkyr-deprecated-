import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { IdentityService } from "../Services/IdentityService";

@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(readonly service: IdentityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [cid, token] = request.headers?.authorization?.split(" ") ?? [];

    if (cid === undefined || token === undefined) {
      return false;
    }

    request.auditor = cid;
    request.token = token;

    return true;
  }
}
