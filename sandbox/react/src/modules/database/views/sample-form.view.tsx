import { Button } from "~components/button.component";

import { controller } from "./sample-form.controller";

export const SampleFormView = controller.view(({ state: { form, errors, processing, error, response } }) => {
  return (
    <div>
      Sample Form
      <form onSubmit={form.submit}>
        <input type="text" placeholder="Enter name" {...form.register("name")} />
        <input type="email" placeholder="Enter email" {...form.register("email")} />
        <Button submit>Submit</Button>
      </form>
      <pre>
        {JSON.stringify(
          {
            errors,
            processing,
            error,
            response
          },
          null,
          2
        )}
      </pre>
    </div>
  );
});
