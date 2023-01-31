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
    `m-0 py-0 shrink-0 ring-0 focus:ring-0 focus:outline-none leading-none flex flex-row gap-2 justify-center items-center transition-colors duration-200 z-100`,
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
      return "h-12 px-10 rounded-full text-sm border-2";
    case "medium":
      return "h-9 px-6 rounded-full text-sm border-2";
    case "header":
      return "h-6 px-3 rounded-full text-sm border";
    case "base":
    default:
      return "px-3 h-8 rounded-full text-xs border";
  }
}

function getColors(variant: ButtonVariant, outline: boolean, disabled: boolean): string {
  if (disabled) {
    return outline
      ? "bg-transparent border-darker-600 text-darker-400"
      : "bg-darker-700 border-darker-700 text-darker-400";
  }
  switch (variant) {
    case "cta": {
      return outline
        ? "bg-transparent border-cyan text-cyan hover:bg-cyan-50 hover:border-cyan-500 hover:bg-opacity-10"
        : "bg-cyan border-cyan text-light hover:bg-cyan-50 hover:border-cyan-50";
    }
    case "primary":
      return outline
        ? "bg-transparent border-pink text-pink hover:bg-pink-50 hover:border-pink-500 hover:bg-opacity-10"
        : "bg-pink border-pink text-white hover:bg-pink-50 hover:border-pink-50";
    case "negative":
      return outline
        ? "bg-transparent border-red text-red hover:bg-red-50 hover:border-red-500 hover:bg-opacity-10"
        : "bg-red border-red text-white hover:bg-red-400 hover:border-red-400";
    case "secondary":
    default:
      return "";
  }
}
