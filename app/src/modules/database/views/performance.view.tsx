import { PerformanceController } from "./performance.controller";

export const PerformanceView = PerformanceController.view(({ state, actions: { start } }) => {
  return (
    <div>
      <button onClick={start}>Start</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
});
