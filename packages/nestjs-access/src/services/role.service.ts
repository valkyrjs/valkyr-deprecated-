import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RoleDocument, RoleEntity } from "../models/role.entity";

/**
 * Proxy service to be able to inject model for utilization in the AccessService
 * class. This is needed because when extending AccessService the @InjectModel()
 * decorator does not properly resolve the dependency.
 *
 * By resolving the dependency in a non extended entity such as the role service
 * we can proxy the injected and assign it to the AccessService class.
 *
 * Do not populate this service, its simply used for dependency injection of the
 * mongoose model.
 */
@Injectable()
export class RoleService {
  constructor(@InjectModel(RoleEntity.name) readonly model: Model<RoleDocument>) {}
}
