import { EventValidator, Validate, Validator } from "@valkyr/angular";
import { TemplateStore } from "stores";

@Validator()
export class TemplateValidator extends EventValidator {
  @Validate("TemplateCreated")
  public async onTemplateCreated(_: TemplateStore.Created) {
    // throw new Error("Template Violation: Member does not have required permission to create");
  }
}
