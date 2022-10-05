---
title: Form
sections: ["React"]
---

In an attempt to provide some convenience tooling around the controller patterns introduced by `@valkyr/react` we want to make it as easy as possible to create and manage forms. The idea is to provide a highly performant library that is easy to use and provides a simple way to create forms.

Lets start by creating a new form:

```ts
import { Form, Joi } from "@valkyr/react";

export class CreateUserForm extends Form<{
  name: string;
  email: string;
}> {
  readonly schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required()
  });

  static async submit(form: CreateUserForm): Promise<void> {
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(form.get())
    });
    form.reset(); // reset the form back to the default values
  }
}
```

The form can now be added to a controller:

```ts
class UserController extends Controller<State> {
  async resolve() {
    this.setState(
      "form",
      new CreateUserForm({
        name: "",
        email: ""
      })
    );
  }
}

type State = {
  form: CreateUserForm;
};
```

And now we can register form state with our view:

```tsx
const UserView = controller.view(({ state: { form } }) => (
  <form onSubmit={form.submit}>
    <input {...form.register("name")} />
    <input {...form.register("email")} />
    <button type="submit">Create</button>
  </form>
));
```
