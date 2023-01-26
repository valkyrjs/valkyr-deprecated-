import { Disclosure } from "@headlessui/react";
import { DotsSixVertical, Eye, EyeClosed, XSquare } from "phosphor-react";

import { UnstyledButton } from "./unstyled-button";

export function BlockHeader({
  open,
  color,
  symbol,
  content,
  onRemove
}: {
  open: boolean;
  color: string;
  symbol: string;
  content: string | JSX.Element;
  onRemove?: () => void;
}) {
  return (
    <header
      className={`flex w-full gap-2 text-darker-700 items-center justify-between ${
        open && "border-b border-b-darker-800"
      } py-1 px-2`}
      style={{ height: 35 }}
    >
      <div className="flex h-full items-center text-darker-400 hover:text-darker-200">
        <div className="node-drag-handle absolute" style={{ top: 0, left: 0, width: 35, height: 35 }}></div>
        <DotsSixVertical size={16} />
      </div>
      <div className={`border ${getColor(color)} rounded w-5 h-5 flex items-center justify-center`}>{symbol}</div>
      <div className="w-full">{content}</div>
      <Disclosure.Button className="w-7 text-darker-400">
        {open ? <Eye size={16} /> : <EyeClosed size={16} />}
      </Disclosure.Button>
      <UnstyledButton className="text-darker-700 hover:text-darker-600" onClick={onRemove}>
        <XSquare size={16} />
      </UnstyledButton>
    </header>
  );
}

function getColor(color: string): string {
  switch (color) {
    case "green":
      return `border-green text-green`;
    case "orange":
      return `border-orange text-orange`;
    case "cyan":
      return `border-cyan text-cyan`;
    default:
      return `border-pink text-pink`;
  }
}
