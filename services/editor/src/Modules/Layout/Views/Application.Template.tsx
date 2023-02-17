import { createElement } from "react";

import { Link } from "~Components/Link";

import { navigation } from "../Library/Navigation";
import { ApplicationController } from "./Application.Controller";

export const ApplicationTemplate = ApplicationController.view(({ state: { routed } }) => {
  return (
    <div className="grid grid-cols-[240px_1fr] antialiased">
      <aside className="h-screen overflow-y-auto bg-gray-800">
        <div className="sticky px-3 py-4">
          <ul className="space-y-1">
            {navigation.map((props) => (
              <li key={props.title}>
                {props.type === "header" ? (
                  <div className="mt-5 text-gray-400">{props.title}</div>
                ) : (
                  <Link
                    href={props.href}
                    className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <props.icon className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ml-3 text-sm">{props.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main>{routed !== undefined ? createElement(routed.component, routed.props) : null}</main>
    </div>
  );
});
