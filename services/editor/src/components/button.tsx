export interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: ButtonVariant;
  sized?: ButtonSize;
  outline?: boolean;
}

export function Button({
  type = "button",
  variant = "secondary",
  sized = "base",
  outline = false,
  disabled = false,
  children,
  ...other
}: ButtonProps) {
  const cx = [
    `border-2 border-transparent m-0 py-0 shrink-0 ring-0 focus:ring-0 focus:outline-none leading-none flex flex-row gap-2 justify-center items-center transition-colors duration-200 z-100`,
    getSize(sized),
    getColors(variant, outline, disabled)
  ].join(" ");

  return (
    <button type={type} disabled={disabled} className={cx} {...other}>
      {children}
    </button>
  );
}

export type ButtonVariant = "cta" | "primary" | "secondary" | "negative";

export type ButtonSize = "base" | "medium" | "large" | "header";

function getSize(size: ButtonSize): string {
  switch (size) {
    case "large":
      return "h-12 px-10 rounded-full text-sm";
    case "medium":
      return "h-9 px-6 rounded-full text-sm";
    case "header":
      return "h-6 px-3 rounded-full text-sm";
    case "base":
    default:
      return "px-3 h-8 rounded-full text-xs";
  }
}

function getColors(variant: ButtonVariant, outline: boolean, disabled: boolean): string {
  if (disabled) {
    return outline ? "bg-transparent border-gray-200 text-gray-400" : "bg-gray-200 border-gray-200 text-gray-400";
  }
  switch (variant) {
    case "cta": {
      return outline
        ? "bg-transparent border-cta-default text-cta-default hover:bg-cta-light hover:border-cta-hover"
        : "bg-cta-static border-cta-static text-static-white hover:bg-cta-static-hover hover:border-cta-static-hover";
    }
    case "primary":
      return outline
        ? "bg-transparent border-primary-default text-black hover:bg-primary-light hover:border-primary-hover"
        : "bg-primary-default border-primary-default text-white hover:bg-primary-hover hover:border-primary-hover";
    case "negative":
      return outline
        ? "bg-transparent border-negative-light text-negative-light hover:bg-negative-outlineHover"
        : "bg-negative-default border-negative-default text-static-white hover:bg-negative-hover hover:border-negative-hover";
    case "secondary":
    default:
      return "";
  }
}
