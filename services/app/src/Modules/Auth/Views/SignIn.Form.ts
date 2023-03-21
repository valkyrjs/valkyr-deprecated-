import { ControllerForm } from "@valkyr/solid";
import Joi from "joi";

import { auth } from "~Services/Auth";
import { router } from "~Services/Router";
import { supabase } from "~Services/Supabase";

export class SignInForm extends ControllerForm<{
  email: string;
  password: string;
}> {
  readonly schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "You must provide a email address",
        "string.email": "You must provide a valid email address"
      }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "You must provide a password",
      "string.min": "Password must be at least 8 characters"
    })
  });

  static async submit(form: SignInForm): Promise<string | void> {
    const { email, password } = form.get();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error !== null) {
      throw error;
    }
    onTokenSet(() => {
      router.goTo("/");
    });
  }
}

function onTokenSet(callback: () => void) {
  if (auth.isValid === true) {
    callback();
  } else {
    setTimeout(onTokenSet, 100, callback);
  }
}
