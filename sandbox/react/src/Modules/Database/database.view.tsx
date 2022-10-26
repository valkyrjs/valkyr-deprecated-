import { controller } from "./database.controller";

export const DatabaseView = controller.view(({ state: { tests }, actions: { run } }) => {
  return (
    <div>
      <div>Database Testing</div>
      <button onClick={run}>Run</button>
      <pre>{JSON.stringify(tests, null, 2)}</pre>
    </div>
  );
});
