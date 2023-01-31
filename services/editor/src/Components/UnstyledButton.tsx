import React, { PropsWithChildren } from "react";

export function UnstyledButton({
  onClick,
  className = "",
  disabled = false,
  children
}: PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
}>): JSX.Element | null {
  const css = `text-xs border-0 m-0 p-0 w-auto inline-flex justify-center items-center gap-1 cursor-pointer`;
  const currentCss = css.split(" ");
  if (className) {
    // TODO: rethink how to do selective overrides.
    currentCss.forEach((rule) => {
      if (className.includes("w-") && rule === "w-auto") {
        // do nothing
      } else if (className.includes("justify-") && rule === "justify-center") {
        // do nothing
      } else if (className.includes("items-") && rule === "items-center") {
        // do nothing
      } else if (className.includes("flex") && rule === "inline-flex") {
        // do nothing
      } else {
        // still put it first, so it may be overridden.
        className = `${rule} ${className}`;
      }
    });
  }

  return (
    <button type="button" onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}
