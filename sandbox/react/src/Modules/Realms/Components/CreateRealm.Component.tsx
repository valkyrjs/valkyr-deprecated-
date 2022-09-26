import { controller } from "./CreateRealm.Controller";

export const CreateRealm = controller.view(({ state: { form, errors } }) => {
  return (
    <form onSubmit={form.submit} style={{ padding: 20, border: "1px solid #ccc" }}>
      <div>
        <input type="text" {...form.register("name")} />
        {errors.name && <p>{errors.name}</p>}
      </div>
      <div>
        <input type="text" {...form.register("color")} />
        {errors.color && <p>{errors.color}</p>}
      </div>
      <button type="submit" disabled={form.hasError}>
        Create Realm
      </button>
    </form>
  );
});
