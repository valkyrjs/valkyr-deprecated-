import { Form, Joi } from "@valkyr/react";

export class SampleForm extends Form<{
  name: string;
  email: string;
}> {
  readonly schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
  });

  static async submit(form: SampleForm): Promise<string | void> {
    return new Promise((resolve, reject) => {
      if (Math.random() >= 0.5) {
        setTimeout(resolve, 2000, form.get("name"));
      } else {
        setTimeout(reject, 2000, "random error");
      }
    });
  }
}
