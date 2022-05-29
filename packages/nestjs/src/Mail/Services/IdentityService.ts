import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Signature } from "@valkyr/security";
import { Model } from "mongoose";

import { Mail, MailDocument } from "../Models/Mail";

@Injectable()
export class MailService {
  constructor(@InjectModel(Mail.name) readonly model: Model<MailDocument>) {}

  async create(data: MailDocument): Promise<void> {
    await this.model.create(data);
  }

  async get(receiver: string): Promise<Mail[]> {
    return this.model.find({ receiver });
  }

  async verify(token: string, signature: string) {
    try {
      await Signature.verify(token, signature);
    } catch (err) {
      return false;
    }
    return true;
  }
}
