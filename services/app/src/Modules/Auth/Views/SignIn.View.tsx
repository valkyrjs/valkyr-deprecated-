import { Link } from "~Components/Link.Component";

import { SignInController } from "./SignIn.Controller";

export const SignInView = SignInController.view(({ state }) => {
  console.log(state.errors);
  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="min-w-[320px]">
        <div>
          <h1 class="mb-4 text-center text-2xl font-bold leading-tight">Sign In</h1>
          <form onSubmit={state.form.submit}>
            <div class="mb-2">
              <label class="block text-gray-400">User Email</label>
              <input
                type="text"
                placeholder="Enter email"
                class="mt-2 w-full rounded-lg border border-gray-500 bg-gray-700 px-4 py-3 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                {...state.form.register("email")}
              />
              <div class="mt-1 pl-1 text-sm text-red-500">{state.errors?.email ?? null}</div>
            </div>
            <div class="mb-2">
              <label class="block text-gray-400">User Password</label>
              <input
                type="password"
                placeholder="Enter password"
                class="mt-2 w-full rounded-lg border border-gray-500 bg-gray-700 px-4 py-3 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                {...state.form.register("password")}
              />
              <div class="mt-1 pl-1 text-sm text-red-500">{state.errors?.password ?? null}</div>
            </div>
            <button
              type="submit"
              class="mt-6 block w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold
          text-white hover:bg-indigo-400 focus:bg-indigo-400"
            >
              Sign In
            </button>
          </form>
          <div class="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" class="text-indigo-400 hover:text-indigo-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
