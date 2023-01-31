import "./button.styles.scss";

import { FunctionComponent, HTMLProps, PropsWithChildren } from "react";

type Props = {
  primary?: boolean;
  secondary?: boolean;
  submit?: boolean;
  reset?: boolean;
} & HTMLProps<HTMLButtonElement>;

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  primary = false,
  secondary = false,
  submit = false,
  reset = false,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      {...getButtonType(submit === true, reset === true)}
      className={`btn${getButtonStyle({ primary, secondary })}`}
    >
      {children}
    </button>
  );
};

function getButtonType(submit: boolean, reset: boolean): { type: "submit" | "reset" | "button" } {
  if (submit === true) {
    return { type: "submit" };
  }
  if (reset === true) {
    return { type: "reset" };
  }
  return { type: "button" };
}

function getButtonStyle({ primary, secondary }: Exclude<Props, "children">) {
  if (primary !== false) {
    return " btn-primary";
  }
  if (secondary !== false) {
    return " btn-secondary";
  }
}
