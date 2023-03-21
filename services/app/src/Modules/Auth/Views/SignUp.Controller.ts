import { Controller } from "@valkyr/solid";

import { SignUpForm } from "./SignUp.Form";

export class SignUpController extends Controller<{
  form: SignUpForm;
  isProcessing: boolean;
  errors?: SignUpForm["errors"];
}> {
  async onInit() {
    this.setState({
      isProcessing: false,
      form: new SignUpForm({
        email: "",
        password: ""
      })
        .onProcessing(this.setState("isProcessing"))
        .onError(this.setState("errors"))
    });
  }
}
