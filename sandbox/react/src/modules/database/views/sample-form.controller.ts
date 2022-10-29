import { Controller, ViewController } from "@valkyr/react";

import { SampleForm } from "./sample-form.form";

class SampleFormController extends Controller<State> {
  async onInit() {
    return {
      form: new SampleForm({
        name: "",
        email: ""
      })
        .onProcessing(this.setState("processing"))
        .onError(this.setState("errors"))
        .onResponse<Error, any>((error, response) => {
          this.setState({ error, response });
        }),
      processing: false
    };
  }
}

type State = {
  form: SampleForm;
  processing: boolean;
  errors?: SampleForm["errors"];
  error?: Error;
  response?: any;
};

export const controller = new ViewController(SampleFormController);
