import { Controller } from "@valkyr/solid";

import { SignInForm } from "./SignIn.Form";

export class SignInController extends Controller<{
  form: SignInForm;
  isProcessing: boolean;
  errors?: SignInForm["errors"];
}> {
  async onInit() {
    this.setState({
      isProcessing: false,
      form: new SignInForm({
        email: "",
        password: ""
      })
        .onProcessing(this.setState("isProcessing"))
        .onError(this.setState("errors"))
    });
  }
}
