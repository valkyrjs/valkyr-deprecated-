import { Archive, ChatText, Cpu, Cube, FileTs, GitMerge, MegaphoneSimple, PhoneOutgoing, Wall } from "phosphor-react";

export const navigation: NavItem[] = [
  {
    type: "header",
    title: "Application"
  },
  {
    type: "link",
    icon: Cpu,
    title: "API",
    href: "/"
  },
  {
    type: "link",
    icon: Cube,
    title: "Container",
    href: "/container"
  },
  {
    type: "link",
    icon: Archive,
    title: "Dependencies",
    href: "/dependencies"
  },
  {
    type: "link",
    icon: FileTs,
    title: "Types",
    href: "/types"
  },
  {
    type: "header",
    title: "Event Sourcing"
  },
  {
    type: "link",
    icon: ChatText,
    title: "Events",
    href: "/events"
  },
  {
    type: "link",
    icon: GitMerge,
    title: "Reducers",
    href: "/reducers"
  },
  {
    type: "link",
    icon: Wall,
    title: "Validators",
    href: "/validators"
  },
  {
    type: "link",
    icon: MegaphoneSimple,
    title: "Projectors",
    href: "/projectors"
  },
  {
    type: "header",
    title: "Remote Procedure Calls"
  },
  {
    type: "link",
    icon: PhoneOutgoing,
    title: "Methods",
    href: "/methods"
  }
];

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
