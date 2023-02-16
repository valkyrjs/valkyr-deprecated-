import { Archive, ChatText, Cpu, Cube, Detective, FileTs, MegaphoneSimple, PhoneOutgoing, Wall } from "phosphor-react";
import { createElement } from "react";

import { Link } from "~Components/Link";

import { CodeController } from "./Code.Controller";

type NavItem =
  | {
      type: "header";
      title: string;
    }
  | {
      type: "link";
      icon: any;
      title: string;
      href: string;
    };

const views: NavItem[] = [
  {
    type: "header",
    title: "Main"
  },
  {
    type: "link",
    icon: Cpu,
    title: "API",
    href: "/api"
  },
  {
    type: "link",
    icon: Cube,
    title: "Container",
    href: "/api/container"
  },
  {
    type: "link",
    icon: Archive,
    title: "Dependencies",
    href: "/api/dependencies"
  },
  {
    type: "link",
    icon: FileTs,
    title: "Types",
    href: "/api/types"
  },
  {
    type: "header",
    title: "Event Sourcing"
  },
  {
    type: "link",
    icon: ChatText,
    title: "Events",
    href: "/api/events"
  },
  {
    type: "link",
    icon: Detective,
    title: "States",
    href: "/api/states"
  },
  {
    type: "link",
    icon: Wall,
    title: "Validators",
    href: "/api/validators"
  },
  {
    type: "link",
    icon: MegaphoneSimple,
    title: "Projectors",
    href: "/api/projectors"
  },
  {
    type: "header",
    title: "Remote Procedure Calls"
  },
  {
    type: "link",
    icon: PhoneOutgoing,
    title: "Methods",
    href: "/api/methods"
  }
];

export const CodeView = CodeController.view(({ state: { routed } }) => {
  return (
    <div className="flex h-screen antialiased">
      <aside className="w-64 bg-gray-50 px-3 py-4 dark:bg-gray-800">
        <div className="overflow-y-auto">
          <ul className="space-y-1">
            {views.map((props) => (
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
      <main className="flex-1">{routed !== undefined ? createElement(routed.component, routed.props) : null}</main>
    </div>
  );
});
