import { controller } from "./CreateRealm.Controller";

export const CreateRealm = controller.view(({ state: { form } }) => {
  return (
    <form onSubmit={form.submit}>
      <input type="text" {...form.register("name")} />
      <input type="text" {...form.register("color")} />
      <button type="submit">Create Realm</button>
    </form>
  );
});
