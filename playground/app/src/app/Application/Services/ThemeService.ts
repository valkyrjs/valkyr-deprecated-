export type SelectOption = {
  Icon?: ({ size }: { size: number }) => string;
  label: string;
  value: string;
};
export type SelectOptions = SelectOption[];

const light = {
  "--celery-100": "#d9f0dc",
  "--celery-400": "#44b556",
  "--celery-500": "#3da74e",
  "--celery-600": "#379947",
  "--celery-700": "#318b40",
  "--chartreuse-100": "#e6f5d9",
  "--chartreuse-400": "#85d044",
  "--chartreuse-500": "#7cc33f",
  "--chartreuse-600": "#73b53a",
  "--chartreuse-700": "#6aa834",
  "--yellow-100": "#fff6c5",
  "--yellow-400": "#dfbf00",
  "--yellow-500": "#d2b200",
  "--yellow-600": "#c4a600",
  "--yellow-700": "#b79900",
  "--magenta-100": "#f7d7e8",
  "--magenta-400": "#d83790",
  "--magenta-500": "#ce2783",
  "--magenta-600": "#bc1c74",
  "--magenta-700": "#ae0e66",
  "--fuchsia-100": "#f2d7f4",
  "--fuchsia-400": "#c038cc",
  "--fuchsia-500": "#b130bd",
  "--fuchsia-600": "#a228ad",
  "--fuchsia-700": "#93219e",
  "--purple-100": "#e9ddf7",
  "--purple-400": "#9256d9",
  "--purple-500": "#864ccc",
  "--purple-600": "#7a42bf",
  "--purple-700": "#6f38b1",
  "--indigo-100": "#e0e0fb",
  "--indigo-400": "#6767ec",
  "--indigo-500": "#5c5ce0",
  "--indigo-600": "#5151d3",
  "--indigo-700": "#4646c6",
  "--seafoam-100": "#c7f3f5",
  "--seafoam-400": "#1b959a",
  "--seafoam-500": "#16878c",
  "--seafoam-600": "#0f797d",
  "--seafoam-700": "#096c6f",
  "--red-100": "#f9dadc",
  "--red-400": "#e34850",
  "--red-500": "#d7373f",
  "--red-600": "#c9252d",
  "--red-700": "#bb121a",
  "--orange-100": "#fae6d1",
  "--orange-400": "#e68619",
  "--orange-500": "#da7b11",
  "--orange-600": "#cb6f10",
  "--orange-700": "#bd640d",
  "--green-100": "#cff1e5",
  "--green-400": "#2d9d78",
  "--green-500": "#268e6c",
  "--green-600": "#12805c",
  "--green-700": "#107154",
  "--blue-100": "#d3e5fb",
  "--blue-400": "#2680eb",
  "--blue-500": "#1473e6",
  "--blue-600": "#0d66d0",
  "--blue-700": "#095aba",
  "--black-50": "#fff",
  "--black-75": "#fafafa",
  "--black-100": "#f5f5f5",
  "--black-200": "#eaeaea",
  "--black-300": "#e1e1e1",
  "--black-400": "#cacaca",
  "--black-500": "#b3b3b3",
  "--black-600": "#8e8e8e",
  "--black-700": "#6e6e6e",
  "--black-800": "#4b4b4b",
  "--black-900": "#2c2c2c"
};

const dark = {
  "--celery-400": "#3da74e",
  "--celery-500": "#44b556",
  "--celery-600": "#4bc35f",
  "--celery-700": "#51d267",
  "--chartreuse-400": "#7cc33f",
  "--chartreuse-500": "#85d044",
  "--chartreuse-600": "#8ede49",
  "--chartreuse-700": "#9bec54",
  "--yellow-400": "#d2b200",
  "--yellow-500": "#dfbf00",
  "--yellow-600": "#edcc00",
  "--yellow-700": "#fad900",
  "--magenta-400": "#ca2996",
  "--magenta-500": "#d83790",
  "--magenta-600": "#e2499d",
  "--magenta-700": "#ec5aaa",
  "--fuchsia-400": "#b130bd",
  "--fuchsia-500": "#c038cc",
  "--fuchsia-600": "#cf3edc",
  "--fuchsia-700": "#d951e5",
  "--purple-400": "#864ccc",
  "--purple-500": "#9256d9",
  "--purple-600": "#9d64e1",
  "--purple-700": "#a873df",
  "--indigo-400": "#5c5ce0",
  "--indigo-500": "#6767ec",
  "--indigo-600": "#7575f1",
  "--indigo-700": "#8282f6",
  "--seafoam-400": "#16878c",
  "--seafoam-500": "#1b959a",
  "--seafoam-600": "#20a3a8",
  "--seafoam-700": "#23b2b8",
  "--red-400": "#d7373f",
  "--red-500": "#e34850",
  "--red-600": "#ec5b62",
  "--red-700": "#f76d74",
  "--orange-400": "#da7b11",
  "--orange-500": "#e68619",
  "--orange-600": "#f29423",
  "--orange-700": "#f9a43f",
  "--green-400": "#268e6c",
  "--green-500": "#2d9d78",
  "--green-600": "#33ab84",
  "--green-700": "#39b990",
  "--blue-400": "#1473e6",
  "--blue-500": "#2680eb",
  "--blue-600": "#378ef0",
  "--blue-700": "#4b9cf5",
  "--black-50": "#080808",
  "--black-75": "#1a1a1a",
  "--black-100": "#1e1e1e",
  "--black-200": "#2c2c2c",
  "--black-300": "#393939",
  "--black-400": "#494949",
  "--black-500": "#5c5c5c",
  "--black-600": "#7c7c7c",
  "--black-700": "#a2a2a2",
  "--black-800": "#c8c8c8",
  "--black-900": "#efefef"
};

// src/themes/utils.ts
export interface ITheme {
  [key: string]: string;
}

export interface IThemes {
  [key: string]: ITheme;
}

export interface IMappedTheme {
  [key: string]: string | null;
}

export const DEFAULT_THEME = "light";

export const Themes: IThemes = {
  light,
  dark
};

export const applyTheme = (theme: string): void => {
  const themeObject: IMappedTheme = Themes[theme];
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === "name") {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};

// Note.
// The entire color variable needs to be written out so that Tailwind JIT can add them to the CSS bundle.
// Dynamically generating them via `text-${color}-${weight}` will not work.
const randomColors = [
  "text-celery-400 hover:text-celery-700",
  "text-chartreuse-400 hover:text-chartreuse-700",
  "text-yellow-400 hover:text-yellow-700",
  "text-magenta-400 hover:text-magenta-700",
  "text-fuchsia-400 hover:text-fuchsia-700",
  "text-purple-400 hover:text-purple-700",
  "text-indigo-400 hover:bg-text-700",
  "text-seafoam-400 hover:text-seafoam-700",
  "text-red-400 hover:text-red-700",
  "text-orange-400 hover:text-orange-700",
  "text-green-400 hover:text-green-700",
  "text-blue-400 hover:text-blue-700",
  "text-c-400 hover:text-c-700"
];

const randomBgColors = [
  "bg-celery-400 hover:bg-celery-700",
  "bg-chartreuse-400 hover:bg-chartreuse-700",
  "bg-yellow-400 hover:bg-yellow-700",
  "bg-magenta-400 hover:bg-magenta-700",
  "bg-fuchsia-400 hover:bg-fuchsia-700",
  "bg-purple-400 hover:bg-purple-700",
  "bg-indigo-400 hover:bg-indigo-700",
  "bg-seafoam-400 hover:bg-seafoam-700",
  "bg-red-400 hover:bg-red-700",
  "bg-orange-400 hover:bg-orange-700",
  "bg-green-400 hover:bg-green-700",
  "bg-blue-400 hover:bg-blue-700",
  "bg-c-600 hover:bg-c-700"
];

export function getRandomColors(): string {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
}

export function getRandomBgColors(): string {
  return randomBgColors[Math.floor(Math.random() * randomBgColors.length)];
}

const UserColors = [
  "celery",
  "chartreuse",
  "yellow",
  "magenta",
  "fuchsia",
  "purple",
  "indigo",
  "seafoam",
  "red",
  "orange",
  "green",
  "blue"
];

export function getRandomColor(): string {
  return UserColors[Math.floor(Math.random() * UserColors.length)];
}

export function getGridLine(theme: string): string {
  return Themes[theme]["--black-200"];
}

export function toRgba(hex: string, alpha: number) {
  const numbers = hex.substring(1);
  const segments = numbers.match(/../g);
  if (segments) {
    return `rgba(${segments.map((x) => +`0x${x}`)},${alpha})`;
  } else {
    return "";
  }
}

export function getMutedColor(theme: string, name: string, opacity: number): string {
  if (name.length === 0) {
    return "rgba(0,0,0,0)";
  }
  const colorClass = `--${name}-400`;
  if (name.includes("transparent")) {
    return "rgba(0,0,0,0)";
  }
  try {
    console.log(colorClass);
    return toRgba(Themes[theme][colorClass], opacity);
  } catch (error) {
    console.log(theme, name);
  }
  return "rgba(0,0,0,0)";
}

export function getBgEquivalent(colorName: string): string {
  return colorName.replace("text-", "bg-").replace("border-", "bg-");
}

export const ColorOptions: SelectOptions = [
  { label: "none", value: "+transparent" },
  { label: "white", value: "+white" },
  { label: "gray", value: "c" },
  { label: "celery", value: "celery" },
  { label: "chartreuse", value: "chartreuse" },
  { label: "yellow", value: "yellow" },
  { label: "magenta", value: "magenta" },
  { label: "fuchsia", value: "fuchsia" },
  { label: "purple", value: "purple" },
  { label: "indigo", value: "indigo" },
  { label: "seafoam", value: "seafoam" },
  { label: "red", value: "red" },
  { label: "orange", value: "orange" },
  { label: "green", value: "green" },
  { label: "blue", value: "blue" },
  { label: "black", value: "+black" }
];

export function getBorder(side: "t" | "r" | "b" | "l", value: number): string {
  if (value < 1) {
    return "";
  } else if (value < 2) {
    return `border-${side}`;
  }
  return `border-${side}-${value}`;
}

// border-t-1 border-t-2 border-t-3 border-t-4
// border-r-1 border-r-2 border-r-3 border-r-4
// border-b-1 border-b-2 border-b-3 border-b-4
// border-l-1 border-l-2 border-l-3 border-l-4

// text-white text-black text-transparent
// border-white border-black border-transparent
// bg-white bg-black bg-transparent
// ring-purple-500
// border-purple-500
// bg-blue-400 bg-c-400 bg-c-400 border-orange-400 focus:ring-orange-500 focus:border-orange-500

export function getColor(
  prefix: string, // "bg" | "text" | "ring" | "border" | "stroke", (we want to also support hover: focus: prefixes as well)
  colorName: string,
  weight = 400
): string {
  if (colorName.includes("+")) {
    return `${prefix}-${colorName.replace("+", "")}`;
  }
  return `${prefix}-${colorName}-${weight}`;
}
