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
  "--gray-50": "#fff",
  "--gray-75": "#fafafa",
  "--gray-100": "#f5f5f5",
  "--gray-200": "#eaeaea",
  "--gray-300": "#e1e1e1",
  "--gray-400": "#cacaca",
  "--gray-500": "#b3b3b3",
  "--gray-600": "#8e8e8e",
  "--gray-700": "#6e6e6e",
  "--gray-800": "#4b4b4b",
  "--gray-900": "#2c2c2c"
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
  "--gray-50": "#080808",
  "--gray-75": "#1a1a1a",
  "--gray-100": "#1e1e1e",
  "--gray-200": "#2c2c2c",
  "--gray-300": "#393939",
  "--gray-400": "#494949",
  "--gray-500": "#5c5c5c",
  "--gray-600": "#7c7c7c",
  "--gray-700": "#a2a2a2",
  "--gray-800": "#c8c8c8",
  "--gray-900": "#efefef"
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
  return Themes[theme]["--gray-200"];
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

// generated Fri May 06 2022 13:17:55 GMT+1000 (Australian Eastern Standard Time)
const styles = `text-celery-100 stroke-celery-100 border-celery-100 bg-celery-100 ring-celery-100 from-celery-100 to-celery-100 hover:text-celery-100 hover:stroke-celery-100 hover:border-celery-100 hover:bg-celery-100 hover:ring-celery-100 hover:from-celery-100 hover:to-celery-100 focus:text-celery-100 focus:stroke-celery-100 focus:border-celery-100 focus:bg-celery-100 focus:ring-celery-100 focus:from-celery-100 focus:to-celery-100 text-celery-400 stroke-celery-400 border-celery-400 bg-celery-400 ring-celery-400 from-celery-400 to-celery-400 hover:text-celery-400 hover:stroke-celery-400 hover:border-celery-400 hover:bg-celery-400 hover:ring-celery-400 hover:from-celery-400 hover:to-celery-400 focus:text-celery-400 focus:stroke-celery-400 focus:border-celery-400 focus:bg-celery-400 focus:ring-celery-400 focus:from-celery-400 focus:to-celery-400 text-celery-500 stroke-celery-500 border-celery-500 bg-celery-500 ring-celery-500 from-celery-500 to-celery-500 hover:text-celery-500 hover:stroke-celery-500 hover:border-celery-500 hover:bg-celery-500 hover:ring-celery-500 hover:from-celery-500 hover:to-celery-500 focus:text-celery-500 focus:stroke-celery-500 focus:border-celery-500 focus:bg-celery-500 focus:ring-celery-500 focus:from-celery-500 focus:to-celery-500 text-celery-600 stroke-celery-600 border-celery-600 bg-celery-600 ring-celery-600 from-celery-600 to-celery-600 hover:text-celery-600 hover:stroke-celery-600 hover:border-celery-600 hover:bg-celery-600 hover:ring-celery-600 hover:from-celery-600 hover:to-celery-600 focus:text-celery-600 focus:stroke-celery-600 focus:border-celery-600 focus:bg-celery-600 focus:ring-celery-600 focus:from-celery-600 focus:to-celery-600 text-celery-700 stroke-celery-700 border-celery-700 bg-celery-700 ring-celery-700 from-celery-700 to-celery-700 hover:text-celery-700 hover:stroke-celery-700 hover:border-celery-700 hover:bg-celery-700 hover:ring-celery-700 hover:from-celery-700 hover:to-celery-700 focus:text-celery-700 focus:stroke-celery-700 focus:border-celery-700 focus:bg-celery-700 focus:ring-celery-700 focus:from-celery-700 focus:to-celery-700 text-chartreuse-100 stroke-chartreuse-100 border-chartreuse-100 bg-chartreuse-100 ring-chartreuse-100 from-chartreuse-100 to-chartreuse-100 hover:text-chartreuse-100 hover:stroke-chartreuse-100 hover:border-chartreuse-100 hover:bg-chartreuse-100 hover:ring-chartreuse-100 hover:from-chartreuse-100 hover:to-chartreuse-100 focus:text-chartreuse-100 focus:stroke-chartreuse-100 focus:border-chartreuse-100 focus:bg-chartreuse-100 focus:ring-chartreuse-100 focus:from-chartreuse-100 focus:to-chartreuse-100 text-chartreuse-400 stroke-chartreuse-400 border-chartreuse-400 bg-chartreuse-400 ring-chartreuse-400 from-chartreuse-400 to-chartreuse-400 hover:text-chartreuse-400 hover:stroke-chartreuse-400 hover:border-chartreuse-400 hover:bg-chartreuse-400 hover:ring-chartreuse-400 hover:from-chartreuse-400 hover:to-chartreuse-400 focus:text-chartreuse-400 focus:stroke-chartreuse-400 focus:border-chartreuse-400 focus:bg-chartreuse-400 focus:ring-chartreuse-400 focus:from-chartreuse-400 focus:to-chartreuse-400 text-chartreuse-500 stroke-chartreuse-500 border-chartreuse-500 bg-chartreuse-500 ring-chartreuse-500 from-chartreuse-500 to-chartreuse-500 hover:text-chartreuse-500 hover:stroke-chartreuse-500 hover:border-chartreuse-500 hover:bg-chartreuse-500 hover:ring-chartreuse-500 hover:from-chartreuse-500 hover:to-chartreuse-500 focus:text-chartreuse-500 focus:stroke-chartreuse-500 focus:border-chartreuse-500 focus:bg-chartreuse-500 focus:ring-chartreuse-500 focus:from-chartreuse-500 focus:to-chartreuse-500 text-chartreuse-600 stroke-chartreuse-600 border-chartreuse-600 bg-chartreuse-600 ring-chartreuse-600 from-chartreuse-600 to-chartreuse-600 hover:text-chartreuse-600 hover:stroke-chartreuse-600 hover:border-chartreuse-600 hover:bg-chartreuse-600 hover:ring-chartreuse-600 hover:from-chartreuse-600 hover:to-chartreuse-600 focus:text-chartreuse-600 focus:stroke-chartreuse-600 focus:border-chartreuse-600 focus:bg-chartreuse-600 focus:ring-chartreuse-600 focus:from-chartreuse-600 focus:to-chartreuse-600 text-chartreuse-700 stroke-chartreuse-700 border-chartreuse-700 bg-chartreuse-700 ring-chartreuse-700 from-chartreuse-700 to-chartreuse-700 hover:text-chartreuse-700 hover:stroke-chartreuse-700 hover:border-chartreuse-700 hover:bg-chartreuse-700 hover:ring-chartreuse-700 hover:from-chartreuse-700 hover:to-chartreuse-700 focus:text-chartreuse-700 focus:stroke-chartreuse-700 focus:border-chartreuse-700 focus:bg-chartreuse-700 focus:ring-chartreuse-700 focus:from-chartreuse-700 focus:to-chartreuse-700 text-yellow-100 stroke-yellow-100 border-yellow-100 bg-yellow-100 ring-yellow-100 from-yellow-100 to-yellow-100 hover:text-yellow-100 hover:stroke-yellow-100 hover:border-yellow-100 hover:bg-yellow-100 hover:ring-yellow-100 hover:from-yellow-100 hover:to-yellow-100 focus:text-yellow-100 focus:stroke-yellow-100 focus:border-yellow-100 focus:bg-yellow-100 focus:ring-yellow-100 focus:from-yellow-100 focus:to-yellow-100 text-yellow-400 stroke-yellow-400 border-yellow-400 bg-yellow-400 ring-yellow-400 from-yellow-400 to-yellow-400 hover:text-yellow-400 hover:stroke-yellow-400 hover:border-yellow-400 hover:bg-yellow-400 hover:ring-yellow-400 hover:from-yellow-400 hover:to-yellow-400 focus:text-yellow-400 focus:stroke-yellow-400 focus:border-yellow-400 focus:bg-yellow-400 focus:ring-yellow-400 focus:from-yellow-400 focus:to-yellow-400 text-yellow-500 stroke-yellow-500 border-yellow-500 bg-yellow-500 ring-yellow-500 from-yellow-500 to-yellow-500 hover:text-yellow-500 hover:stroke-yellow-500 hover:border-yellow-500 hover:bg-yellow-500 hover:ring-yellow-500 hover:from-yellow-500 hover:to-yellow-500 focus:text-yellow-500 focus:stroke-yellow-500 focus:border-yellow-500 focus:bg-yellow-500 focus:ring-yellow-500 focus:from-yellow-500 focus:to-yellow-500 text-yellow-600 stroke-yellow-600 border-yellow-600 bg-yellow-600 ring-yellow-600 from-yellow-600 to-yellow-600 hover:text-yellow-600 hover:stroke-yellow-600 hover:border-yellow-600 hover:bg-yellow-600 hover:ring-yellow-600 hover:from-yellow-600 hover:to-yellow-600 focus:text-yellow-600 focus:stroke-yellow-600 focus:border-yellow-600 focus:bg-yellow-600 focus:ring-yellow-600 focus:from-yellow-600 focus:to-yellow-600 text-yellow-700 stroke-yellow-700 border-yellow-700 bg-yellow-700 ring-yellow-700 from-yellow-700 to-yellow-700 hover:text-yellow-700 hover:stroke-yellow-700 hover:border-yellow-700 hover:bg-yellow-700 hover:ring-yellow-700 hover:from-yellow-700 hover:to-yellow-700 focus:text-yellow-700 focus:stroke-yellow-700 focus:border-yellow-700 focus:bg-yellow-700 focus:ring-yellow-700 focus:from-yellow-700 focus:to-yellow-700 text-magenta-100 stroke-magenta-100 border-magenta-100 bg-magenta-100 ring-magenta-100 from-magenta-100 to-magenta-100 hover:text-magenta-100 hover:stroke-magenta-100 hover:border-magenta-100 hover:bg-magenta-100 hover:ring-magenta-100 hover:from-magenta-100 hover:to-magenta-100 focus:text-magenta-100 focus:stroke-magenta-100 focus:border-magenta-100 focus:bg-magenta-100 focus:ring-magenta-100 focus:from-magenta-100 focus:to-magenta-100 text-magenta-400 stroke-magenta-400 border-magenta-400 bg-magenta-400 ring-magenta-400 from-magenta-400 to-magenta-400 hover:text-magenta-400 hover:stroke-magenta-400 hover:border-magenta-400 hover:bg-magenta-400 hover:ring-magenta-400 hover:from-magenta-400 hover:to-magenta-400 focus:text-magenta-400 focus:stroke-magenta-400 focus:border-magenta-400 focus:bg-magenta-400 focus:ring-magenta-400 focus:from-magenta-400 focus:to-magenta-400 text-magenta-500 stroke-magenta-500 border-magenta-500 bg-magenta-500 ring-magenta-500 from-magenta-500 to-magenta-500 hover:text-magenta-500 hover:stroke-magenta-500 hover:border-magenta-500 hover:bg-magenta-500 hover:ring-magenta-500 hover:from-magenta-500 hover:to-magenta-500 focus:text-magenta-500 focus:stroke-magenta-500 focus:border-magenta-500 focus:bg-magenta-500 focus:ring-magenta-500 focus:from-magenta-500 focus:to-magenta-500 text-magenta-600 stroke-magenta-600 border-magenta-600 bg-magenta-600 ring-magenta-600 from-magenta-600 to-magenta-600 hover:text-magenta-600 hover:stroke-magenta-600 hover:border-magenta-600 hover:bg-magenta-600 hover:ring-magenta-600 hover:from-magenta-600 hover:to-magenta-600 focus:text-magenta-600 focus:stroke-magenta-600 focus:border-magenta-600 focus:bg-magenta-600 focus:ring-magenta-600 focus:from-magenta-600 focus:to-magenta-600 text-magenta-700 stroke-magenta-700 border-magenta-700 bg-magenta-700 ring-magenta-700 from-magenta-700 to-magenta-700 hover:text-magenta-700 hover:stroke-magenta-700 hover:border-magenta-700 hover:bg-magenta-700 hover:ring-magenta-700 hover:from-magenta-700 hover:to-magenta-700 focus:text-magenta-700 focus:stroke-magenta-700 focus:border-magenta-700 focus:bg-magenta-700 focus:ring-magenta-700 focus:from-magenta-700 focus:to-magenta-700 text-fuchsia-100 stroke-fuchsia-100 border-fuchsia-100 bg-fuchsia-100 ring-fuchsia-100 from-fuchsia-100 to-fuchsia-100 hover:text-fuchsia-100 hover:stroke-fuchsia-100 hover:border-fuchsia-100 hover:bg-fuchsia-100 hover:ring-fuchsia-100 hover:from-fuchsia-100 hover:to-fuchsia-100 focus:text-fuchsia-100 focus:stroke-fuchsia-100 focus:border-fuchsia-100 focus:bg-fuchsia-100 focus:ring-fuchsia-100 focus:from-fuchsia-100 focus:to-fuchsia-100 text-fuchsia-400 stroke-fuchsia-400 border-fuchsia-400 bg-fuchsia-400 ring-fuchsia-400 from-fuchsia-400 to-fuchsia-400 hover:text-fuchsia-400 hover:stroke-fuchsia-400 hover:border-fuchsia-400 hover:bg-fuchsia-400 hover:ring-fuchsia-400 hover:from-fuchsia-400 hover:to-fuchsia-400 focus:text-fuchsia-400 focus:stroke-fuchsia-400 focus:border-fuchsia-400 focus:bg-fuchsia-400 focus:ring-fuchsia-400 focus:from-fuchsia-400 focus:to-fuchsia-400 text-fuchsia-500 stroke-fuchsia-500 border-fuchsia-500 bg-fuchsia-500 ring-fuchsia-500 from-fuchsia-500 to-fuchsia-500 hover:text-fuchsia-500 hover:stroke-fuchsia-500 hover:border-fuchsia-500 hover:bg-fuchsia-500 hover:ring-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-500 focus:text-fuchsia-500 focus:stroke-fuchsia-500 focus:border-fuchsia-500 focus:bg-fuchsia-500 focus:ring-fuchsia-500 focus:from-fuchsia-500 focus:to-fuchsia-500 text-fuchsia-600 stroke-fuchsia-600 border-fuchsia-600 bg-fuchsia-600 ring-fuchsia-600 from-fuchsia-600 to-fuchsia-600 hover:text-fuchsia-600 hover:stroke-fuchsia-600 hover:border-fuchsia-600 hover:bg-fuchsia-600 hover:ring-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-600 focus:text-fuchsia-600 focus:stroke-fuchsia-600 focus:border-fuchsia-600 focus:bg-fuchsia-600 focus:ring-fuchsia-600 focus:from-fuchsia-600 focus:to-fuchsia-600 text-fuchsia-700 stroke-fuchsia-700 border-fuchsia-700 bg-fuchsia-700 ring-fuchsia-700 from-fuchsia-700 to-fuchsia-700 hover:text-fuchsia-700 hover:stroke-fuchsia-700 hover:border-fuchsia-700 hover:bg-fuchsia-700 hover:ring-fuchsia-700 hover:from-fuchsia-700 hover:to-fuchsia-700 focus:text-fuchsia-700 focus:stroke-fuchsia-700 focus:border-fuchsia-700 focus:bg-fuchsia-700 focus:ring-fuchsia-700 focus:from-fuchsia-700 focus:to-fuchsia-700 text-purple-100 stroke-purple-100 border-purple-100 bg-purple-100 ring-purple-100 from-purple-100 to-purple-100 hover:text-purple-100 hover:stroke-purple-100 hover:border-purple-100 hover:bg-purple-100 hover:ring-purple-100 hover:from-purple-100 hover:to-purple-100 focus:text-purple-100 focus:stroke-purple-100 focus:border-purple-100 focus:bg-purple-100 focus:ring-purple-100 focus:from-purple-100 focus:to-purple-100 text-purple-400 stroke-purple-400 border-purple-400 bg-purple-400 ring-purple-400 from-purple-400 to-purple-400 hover:text-purple-400 hover:stroke-purple-400 hover:border-purple-400 hover:bg-purple-400 hover:ring-purple-400 hover:from-purple-400 hover:to-purple-400 focus:text-purple-400 focus:stroke-purple-400 focus:border-purple-400 focus:bg-purple-400 focus:ring-purple-400 focus:from-purple-400 focus:to-purple-400 text-purple-500 stroke-purple-500 border-purple-500 bg-purple-500 ring-purple-500 from-purple-500 to-purple-500 hover:text-purple-500 hover:stroke-purple-500 hover:border-purple-500 hover:bg-purple-500 hover:ring-purple-500 hover:from-purple-500 hover:to-purple-500 focus:text-purple-500 focus:stroke-purple-500 focus:border-purple-500 focus:bg-purple-500 focus:ring-purple-500 focus:from-purple-500 focus:to-purple-500 text-purple-600 stroke-purple-600 border-purple-600 bg-purple-600 ring-purple-600 from-purple-600 to-purple-600 hover:text-purple-600 hover:stroke-purple-600 hover:border-purple-600 hover:bg-purple-600 hover:ring-purple-600 hover:from-purple-600 hover:to-purple-600 focus:text-purple-600 focus:stroke-purple-600 focus:border-purple-600 focus:bg-purple-600 focus:ring-purple-600 focus:from-purple-600 focus:to-purple-600 text-purple-700 stroke-purple-700 border-purple-700 bg-purple-700 ring-purple-700 from-purple-700 to-purple-700 hover:text-purple-700 hover:stroke-purple-700 hover:border-purple-700 hover:bg-purple-700 hover:ring-purple-700 hover:from-purple-700 hover:to-purple-700 focus:text-purple-700 focus:stroke-purple-700 focus:border-purple-700 focus:bg-purple-700 focus:ring-purple-700 focus:from-purple-700 focus:to-purple-700 text-indigo-100 stroke-indigo-100 border-indigo-100 bg-indigo-100 ring-indigo-100 from-indigo-100 to-indigo-100 hover:text-indigo-100 hover:stroke-indigo-100 hover:border-indigo-100 hover:bg-indigo-100 hover:ring-indigo-100 hover:from-indigo-100 hover:to-indigo-100 focus:text-indigo-100 focus:stroke-indigo-100 focus:border-indigo-100 focus:bg-indigo-100 focus:ring-indigo-100 focus:from-indigo-100 focus:to-indigo-100 text-indigo-400 stroke-indigo-400 border-indigo-400 bg-indigo-400 ring-indigo-400 from-indigo-400 to-indigo-400 hover:text-indigo-400 hover:stroke-indigo-400 hover:border-indigo-400 hover:bg-indigo-400 hover:ring-indigo-400 hover:from-indigo-400 hover:to-indigo-400 focus:text-indigo-400 focus:stroke-indigo-400 focus:border-indigo-400 focus:bg-indigo-400 focus:ring-indigo-400 focus:from-indigo-400 focus:to-indigo-400 text-indigo-500 stroke-indigo-500 border-indigo-500 bg-indigo-500 ring-indigo-500 from-indigo-500 to-indigo-500 hover:text-indigo-500 hover:stroke-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:ring-indigo-500 hover:from-indigo-500 hover:to-indigo-500 focus:text-indigo-500 focus:stroke-indigo-500 focus:border-indigo-500 focus:bg-indigo-500 focus:ring-indigo-500 focus:from-indigo-500 focus:to-indigo-500 text-indigo-600 stroke-indigo-600 border-indigo-600 bg-indigo-600 ring-indigo-600 from-indigo-600 to-indigo-600 hover:text-indigo-600 hover:stroke-indigo-600 hover:border-indigo-600 hover:bg-indigo-600 hover:ring-indigo-600 hover:from-indigo-600 hover:to-indigo-600 focus:text-indigo-600 focus:stroke-indigo-600 focus:border-indigo-600 focus:bg-indigo-600 focus:ring-indigo-600 focus:from-indigo-600 focus:to-indigo-600 text-indigo-700 stroke-indigo-700 border-indigo-700 bg-indigo-700 ring-indigo-700 from-indigo-700 to-indigo-700 hover:text-indigo-700 hover:stroke-indigo-700 hover:border-indigo-700 hover:bg-indigo-700 hover:ring-indigo-700 hover:from-indigo-700 hover:to-indigo-700 focus:text-indigo-700 focus:stroke-indigo-700 focus:border-indigo-700 focus:bg-indigo-700 focus:ring-indigo-700 focus:from-indigo-700 focus:to-indigo-700 text-seafoam-100 stroke-seafoam-100 border-seafoam-100 bg-seafoam-100 ring-seafoam-100 from-seafoam-100 to-seafoam-100 hover:text-seafoam-100 hover:stroke-seafoam-100 hover:border-seafoam-100 hover:bg-seafoam-100 hover:ring-seafoam-100 hover:from-seafoam-100 hover:to-seafoam-100 focus:text-seafoam-100 focus:stroke-seafoam-100 focus:border-seafoam-100 focus:bg-seafoam-100 focus:ring-seafoam-100 focus:from-seafoam-100 focus:to-seafoam-100 text-seafoam-400 stroke-seafoam-400 border-seafoam-400 bg-seafoam-400 ring-seafoam-400 from-seafoam-400 to-seafoam-400 hover:text-seafoam-400 hover:stroke-seafoam-400 hover:border-seafoam-400 hover:bg-seafoam-400 hover:ring-seafoam-400 hover:from-seafoam-400 hover:to-seafoam-400 focus:text-seafoam-400 focus:stroke-seafoam-400 focus:border-seafoam-400 focus:bg-seafoam-400 focus:ring-seafoam-400 focus:from-seafoam-400 focus:to-seafoam-400 text-seafoam-500 stroke-seafoam-500 border-seafoam-500 bg-seafoam-500 ring-seafoam-500 from-seafoam-500 to-seafoam-500 hover:text-seafoam-500 hover:stroke-seafoam-500 hover:border-seafoam-500 hover:bg-seafoam-500 hover:ring-seafoam-500 hover:from-seafoam-500 hover:to-seafoam-500 focus:text-seafoam-500 focus:stroke-seafoam-500 focus:border-seafoam-500 focus:bg-seafoam-500 focus:ring-seafoam-500 focus:from-seafoam-500 focus:to-seafoam-500 text-seafoam-600 stroke-seafoam-600 border-seafoam-600 bg-seafoam-600 ring-seafoam-600 from-seafoam-600 to-seafoam-600 hover:text-seafoam-600 hover:stroke-seafoam-600 hover:border-seafoam-600 hover:bg-seafoam-600 hover:ring-seafoam-600 hover:from-seafoam-600 hover:to-seafoam-600 focus:text-seafoam-600 focus:stroke-seafoam-600 focus:border-seafoam-600 focus:bg-seafoam-600 focus:ring-seafoam-600 focus:from-seafoam-600 focus:to-seafoam-600 text-seafoam-700 stroke-seafoam-700 border-seafoam-700 bg-seafoam-700 ring-seafoam-700 from-seafoam-700 to-seafoam-700 hover:text-seafoam-700 hover:stroke-seafoam-700 hover:border-seafoam-700 hover:bg-seafoam-700 hover:ring-seafoam-700 hover:from-seafoam-700 hover:to-seafoam-700 focus:text-seafoam-700 focus:stroke-seafoam-700 focus:border-seafoam-700 focus:bg-seafoam-700 focus:ring-seafoam-700 focus:from-seafoam-700 focus:to-seafoam-700 text-red-100 stroke-red-100 border-red-100 bg-red-100 ring-red-100 from-red-100 to-red-100 hover:text-red-100 hover:stroke-red-100 hover:border-red-100 hover:bg-red-100 hover:ring-red-100 hover:from-red-100 hover:to-red-100 focus:text-red-100 focus:stroke-red-100 focus:border-red-100 focus:bg-red-100 focus:ring-red-100 focus:from-red-100 focus:to-red-100 text-red-400 stroke-red-400 border-red-400 bg-red-400 ring-red-400 from-red-400 to-red-400 hover:text-red-400 hover:stroke-red-400 hover:border-red-400 hover:bg-red-400 hover:ring-red-400 hover:from-red-400 hover:to-red-400 focus:text-red-400 focus:stroke-red-400 focus:border-red-400 focus:bg-red-400 focus:ring-red-400 focus:from-red-400 focus:to-red-400 text-red-500 stroke-red-500 border-red-500 bg-red-500 ring-red-500 from-red-500 to-red-500 hover:text-red-500 hover:stroke-red-500 hover:border-red-500 hover:bg-red-500 hover:ring-red-500 hover:from-red-500 hover:to-red-500 focus:text-red-500 focus:stroke-red-500 focus:border-red-500 focus:bg-red-500 focus:ring-red-500 focus:from-red-500 focus:to-red-500 text-red-600 stroke-red-600 border-red-600 bg-red-600 ring-red-600 from-red-600 to-red-600 hover:text-red-600 hover:stroke-red-600 hover:border-red-600 hover:bg-red-600 hover:ring-red-600 hover:from-red-600 hover:to-red-600 focus:text-red-600 focus:stroke-red-600 focus:border-red-600 focus:bg-red-600 focus:ring-red-600 focus:from-red-600 focus:to-red-600 text-red-700 stroke-red-700 border-red-700 bg-red-700 ring-red-700 from-red-700 to-red-700 hover:text-red-700 hover:stroke-red-700 hover:border-red-700 hover:bg-red-700 hover:ring-red-700 hover:from-red-700 hover:to-red-700 focus:text-red-700 focus:stroke-red-700 focus:border-red-700 focus:bg-red-700 focus:ring-red-700 focus:from-red-700 focus:to-red-700 text-orange-100 stroke-orange-100 border-orange-100 bg-orange-100 ring-orange-100 from-orange-100 to-orange-100 hover:text-orange-100 hover:stroke-orange-100 hover:border-orange-100 hover:bg-orange-100 hover:ring-orange-100 hover:from-orange-100 hover:to-orange-100 focus:text-orange-100 focus:stroke-orange-100 focus:border-orange-100 focus:bg-orange-100 focus:ring-orange-100 focus:from-orange-100 focus:to-orange-100 text-orange-400 stroke-orange-400 border-orange-400 bg-orange-400 ring-orange-400 from-orange-400 to-orange-400 hover:text-orange-400 hover:stroke-orange-400 hover:border-orange-400 hover:bg-orange-400 hover:ring-orange-400 hover:from-orange-400 hover:to-orange-400 focus:text-orange-400 focus:stroke-orange-400 focus:border-orange-400 focus:bg-orange-400 focus:ring-orange-400 focus:from-orange-400 focus:to-orange-400 text-orange-500 stroke-orange-500 border-orange-500 bg-orange-500 ring-orange-500 from-orange-500 to-orange-500 hover:text-orange-500 hover:stroke-orange-500 hover:border-orange-500 hover:bg-orange-500 hover:ring-orange-500 hover:from-orange-500 hover:to-orange-500 focus:text-orange-500 focus:stroke-orange-500 focus:border-orange-500 focus:bg-orange-500 focus:ring-orange-500 focus:from-orange-500 focus:to-orange-500 text-orange-600 stroke-orange-600 border-orange-600 bg-orange-600 ring-orange-600 from-orange-600 to-orange-600 hover:text-orange-600 hover:stroke-orange-600 hover:border-orange-600 hover:bg-orange-600 hover:ring-orange-600 hover:from-orange-600 hover:to-orange-600 focus:text-orange-600 focus:stroke-orange-600 focus:border-orange-600 focus:bg-orange-600 focus:ring-orange-600 focus:from-orange-600 focus:to-orange-600 text-orange-700 stroke-orange-700 border-orange-700 bg-orange-700 ring-orange-700 from-orange-700 to-orange-700 hover:text-orange-700 hover:stroke-orange-700 hover:border-orange-700 hover:bg-orange-700 hover:ring-orange-700 hover:from-orange-700 hover:to-orange-700 focus:text-orange-700 focus:stroke-orange-700 focus:border-orange-700 focus:bg-orange-700 focus:ring-orange-700 focus:from-orange-700 focus:to-orange-700 text-green-100 stroke-green-100 border-green-100 bg-green-100 ring-green-100 from-green-100 to-green-100 hover:text-green-100 hover:stroke-green-100 hover:border-green-100 hover:bg-green-100 hover:ring-green-100 hover:from-green-100 hover:to-green-100 focus:text-green-100 focus:stroke-green-100 focus:border-green-100 focus:bg-green-100 focus:ring-green-100 focus:from-green-100 focus:to-green-100 text-green-400 stroke-green-400 border-green-400 bg-green-400 ring-green-400 from-green-400 to-green-400 hover:text-green-400 hover:stroke-green-400 hover:border-green-400 hover:bg-green-400 hover:ring-green-400 hover:from-green-400 hover:to-green-400 focus:text-green-400 focus:stroke-green-400 focus:border-green-400 focus:bg-green-400 focus:ring-green-400 focus:from-green-400 focus:to-green-400 text-green-500 stroke-green-500 border-green-500 bg-green-500 ring-green-500 from-green-500 to-green-500 hover:text-green-500 hover:stroke-green-500 hover:border-green-500 hover:bg-green-500 hover:ring-green-500 hover:from-green-500 hover:to-green-500 focus:text-green-500 focus:stroke-green-500 focus:border-green-500 focus:bg-green-500 focus:ring-green-500 focus:from-green-500 focus:to-green-500 text-green-600 stroke-green-600 border-green-600 bg-green-600 ring-green-600 from-green-600 to-green-600 hover:text-green-600 hover:stroke-green-600 hover:border-green-600 hover:bg-green-600 hover:ring-green-600 hover:from-green-600 hover:to-green-600 focus:text-green-600 focus:stroke-green-600 focus:border-green-600 focus:bg-green-600 focus:ring-green-600 focus:from-green-600 focus:to-green-600 text-green-700 stroke-green-700 border-green-700 bg-green-700 ring-green-700 from-green-700 to-green-700 hover:text-green-700 hover:stroke-green-700 hover:border-green-700 hover:bg-green-700 hover:ring-green-700 hover:from-green-700 hover:to-green-700 focus:text-green-700 focus:stroke-green-700 focus:border-green-700 focus:bg-green-700 focus:ring-green-700 focus:from-green-700 focus:to-green-700 text-blue-100 stroke-blue-100 border-blue-100 bg-blue-100 ring-blue-100 from-blue-100 to-blue-100 hover:text-blue-100 hover:stroke-blue-100 hover:border-blue-100 hover:bg-blue-100 hover:ring-blue-100 hover:from-blue-100 hover:to-blue-100 focus:text-blue-100 focus:stroke-blue-100 focus:border-blue-100 focus:bg-blue-100 focus:ring-blue-100 focus:from-blue-100 focus:to-blue-100 text-blue-400 stroke-blue-400 border-blue-400 bg-blue-400 ring-blue-400 from-blue-400 to-blue-400 hover:text-blue-400 hover:stroke-blue-400 hover:border-blue-400 hover:bg-blue-400 hover:ring-blue-400 hover:from-blue-400 hover:to-blue-400 focus:text-blue-400 focus:stroke-blue-400 focus:border-blue-400 focus:bg-blue-400 focus:ring-blue-400 focus:from-blue-400 focus:to-blue-400 text-blue-500 stroke-blue-500 border-blue-500 bg-blue-500 ring-blue-500 from-blue-500 to-blue-500 hover:text-blue-500 hover:stroke-blue-500 hover:border-blue-500 hover:bg-blue-500 hover:ring-blue-500 hover:from-blue-500 hover:to-blue-500 focus:text-blue-500 focus:stroke-blue-500 focus:border-blue-500 focus:bg-blue-500 focus:ring-blue-500 focus:from-blue-500 focus:to-blue-500 text-blue-600 stroke-blue-600 border-blue-600 bg-blue-600 ring-blue-600 from-blue-600 to-blue-600 hover:text-blue-600 hover:stroke-blue-600 hover:border-blue-600 hover:bg-blue-600 hover:ring-blue-600 hover:from-blue-600 hover:to-blue-600 focus:text-blue-600 focus:stroke-blue-600 focus:border-blue-600 focus:bg-blue-600 focus:ring-blue-600 focus:from-blue-600 focus:to-blue-600 text-blue-700 stroke-blue-700 border-blue-700 bg-blue-700 ring-blue-700 from-blue-700 to-blue-700 hover:text-blue-700 hover:stroke-blue-700 hover:border-blue-700 hover:bg-blue-700 hover:ring-blue-700 hover:from-blue-700 hover:to-blue-700 focus:text-blue-700 focus:stroke-blue-700 focus:border-blue-700 focus:bg-blue-700 focus:ring-blue-700 focus:from-blue-700 focus:to-blue-700`;
