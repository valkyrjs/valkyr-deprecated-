import { Link } from "~Components/Link.Component";
import { Separator } from "~Components/Separator.Component";

import { WorkspaceController } from "./Workspace.Controller";

export const WorkspaceView = WorkspaceController.view(({ state }) => {
  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="min-w-[320px]">
        <div>
          <h1 class="mb-4 text-center text-2xl font-bold leading-tight">Select Workspace</h1>
          <ul>
            {state.workspaces.length === 0 ? (
              <li class="text-center">No workspaces, why not create a new one?</li>
            ) : (
              state.workspaces.map((workspace) => (
                <li class="my-3 flex items-center justify-between rounded-lg border border-gray-700 bg-slate-800 p-2">
                  <div>{workspace.name}</div>
                  <Link
                    class="rounded-lg bg-indigo-500 px-3 py-1 text-sm font-semibold
              text-white hover:bg-indigo-400 focus:bg-indigo-400"
                    href={`/workspaces/${workspace.id}`}
                  >
                    Enter
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <Separator text="OR" />
        <div>
          <h1 class="mb-4 text-center text-2xl font-bold leading-tight">Create Workspace</h1>
          <form onSubmit={state.form.submit}>
            <div class="mb-2">
              <label class="block text-gray-400">Workspace Name</label>
              <input
                type="text"
                placeholder="Enter workspace name"
                class="mt-2 w-full rounded-lg border border-gray-500 bg-gray-700 px-4 py-3 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                {...state.form.register("name")}
              />
            </div>
            <div class="mb-2">
              <label class="block text-gray-400">Workspace User</label>
              <input
                type="text"
                placeholder="Enter workspace user"
                class="mt-2 w-full rounded-lg border border-gray-500 bg-gray-700 px-4 py-3 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                {...state.form.register("user")}
              />
            </div>
            <button
              type="submit"
              class="mt-6 block w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold
              text-white hover:bg-indigo-400 focus:bg-indigo-400"
            >
              Create Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
