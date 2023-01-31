import { Disclosure } from "@headlessui/react";
import { DotsSixVertical, Eye, EyeClosed, XSquare } from "phosphor-react";

import { UnstyledButton } from "./UnstyledButton";

export function BlockHeader({
  open,
  color,
  symbol,
  content,
  onRemove,
  draggable = true
}: {
  open: boolean;
  color: string;
  symbol: string;
  content: string | JSX.Element;
  onRemove?: () => void;
  draggable?: boolean;
}) {
  return (
    <header
      className={`text-darker-700 flex w-full items-center justify-between gap-2 ${
        open && "border-b-darker-800 border-b"
      } h-9 pl-2 pr-2`}
      style={{ height: 35 }}
    >
      {draggable && (
        <div className="text-darker-400 hover:text-darker-200 flex h-full items-center">
          <div className="node-drag-handle absolute top-0 left-0 h-9 w-9"></div>
          <DotsSixVertical size={16} />
        </div>
      )}
      <div className={`border ${getColor(color)} flex h-5 w-5 items-center justify-center rounded`}>{symbol}</div>
      <div className="w-full">{content}</div>
      <Disclosure.Button className="text-darker-400 hover:text-cyan w-7">
        {open ? <Eye size={16} /> : <EyeClosed size={16} />}
      </Disclosure.Button>
      <UnstyledButton className="text-darker-400 hover:text-red-300" onClick={onRemove}>
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
