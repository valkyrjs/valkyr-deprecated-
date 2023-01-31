import { Controller } from "@valkyr/react";

import { SampleForm } from "./sample-form.form";

export class SampleFormController extends Controller<{
  form: SampleForm;
  processing: boolean;
  errors?: SampleForm["errors"];
  error?: Error;
  response?: any;
}> {
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
