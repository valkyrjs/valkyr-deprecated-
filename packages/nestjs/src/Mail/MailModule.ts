import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MailController } from "./Controllers/IdentityController";
import { Mail, MailSchema } from "./Models/Mail";
import { MailService } from "./Services/IdentityService";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Mail.name,
        schema: MailSchema
      }
    ])
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
