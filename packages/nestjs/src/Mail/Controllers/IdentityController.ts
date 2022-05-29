import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { IdentitySignature, Signed } from "../../Decorators";
import { Mail, MailDocument } from "../Models/Mail";
import { MailService } from "../Services/IdentityService";

@Controller("/mail")
export class MailController {
  constructor(readonly mail: MailService) {}

  @Post()
  public async sendMail(@Body() body: MailDocument): Promise<void> {
    await this.mail.create(body);
  }

  @Get(":receiver")
  public async getMail(@Param("receiver") receiver: string, @Signed() signer: IdentitySignature): Promise<Mail[]> {
    const mail = await this.mail.get(receiver);
    const sack = [];
    for (const value of mail) {
      if (await this.mail.verify(signer.token, value.signature)) {
        sack.push(value);
      }
    }
    return sack;
  }
}
