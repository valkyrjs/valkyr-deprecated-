import { createComponent, Match, Switch } from "solid-js";

export function ControllerView({ $components, controller }: any) {
  return (
    <Switch>
      <Match when={controller.$lifecycle.loading === true}>{createComponent($components.loading, {})}</Match>
      <Match when={controller.$lifecycle.error !== undefined}>
        {createComponent($components.loading, { error: controller.$lifecycle.error })}
      </Match>
      <Match when={controller.$lifecycle.loading === false && controller.$lifecycle.error === undefined}>
        {createComponent($components.view, {
          props: controller.props,
          state: controller.state,
          actions: controller.toActions()
        })}
      </Match>
    </Switch>
  );
}
