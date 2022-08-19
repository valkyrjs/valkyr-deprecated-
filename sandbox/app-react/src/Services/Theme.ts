import { SelectOptions } from "@App/Components/Select";

const dark = {
  "--celery-400": "34 184 51",
  "--celery-500": "68 202 73",
  "--celery-600": "105 220 99",
  "--celery-700": "142 235 127",
  "--chartreuse-400": "148 192 8",
  "--chartreuse-500": "166 211 18",
  "--chartreuse-600": "184 229 37",
  "--chartreuse-700": "205 245 71",
  "--yellow-400": "228 194 0",
  "--yellow-500": "244 213 0",
  "--yellow-600": "249 232 92",
  "--yellow-700": "252 246 187",
  "--magenta-400": "222 61 130",
  "--magenta-500": "237 87 149",
  "--magenta-600": "249 114 167",
  "--magenta-700": "255 143 185",
  "--fuchsia-400": "205 57 206",
  "--fuchsia-500": "223 81 224",
  "--fuchsia-600": "235 110 236",
  "--fuchsia-700": "244 140 242",
  "--purple-400": "157 87 243",
  "--purple-500": "172 111 249",
  "--purple-600": "187 135 251",
  "--purple-700": "202 159 252",
  "--indigo-400": "104 109 244",
  "--indigo-500": "124 129 251",
  "--indigo-600": "145 149 255",
  "--indigo-700": "167 170 255",
  "--seafoam-400": "0 158 152",
  "--seafoam-500": "3 178 171",
  "--seafoam-600": "54 197 189",
  "--seafoam-700": "93 214 207",
  "--red-100": "66 43 43",
  "--red-400": "234 56 41",
  "--red-500": "246 88 67",
  "--red-600": "255 117 94",
  "--red-700": "255 149 129",
  "--orange-400": "244 129 12",
  "--orange-500": "254 154 46",
  "--orange-600": "255 181 88",
  "--orange-700": "253 206 136",
  "--green-400": "18 162 108",
  "--green-500": "43 180 125",
  "--green-600": "67 199 143",
  "--green-700": "94 217 162",
  "--blue-100": "43 56 71",
  "--blue-400": "52 143 244",
  "--blue-500": "84 163 246",
  "--blue-600": "114 183 249",
  "--blue-700": "143 202 252",
  "--gray-50": "29 29 29",
  "--gray-75": "38 38 38",
  "--gray-100": "50 50 50",
  "--gray-200": "63 63 63",
  "--gray-300": "84 84 84",
  "--gray-400": "112 112 112",
  "--gray-500": "144 144 144",
  "--gray-600": "178 178 178",
  "--gray-700": "209 209 209",
  "--gray-800": "235 235 235",
  "--gray-900": "255 255 255",
  "--static-black": "29 29 29",
  "--static-white": "255 255 255",
  "--static-blue": "0 84 182",
  "--static-red": "180 0 0",
  "--static-blue-700": "0 68 145",
  "--static-red-700": "147 0 0"
};

const light = {
  "--celery-400": "39 187 54",
  "--celery-500": "7 167 33",
  "--celery-600": "0 145 18",
  "--celery-700": "0 124 15",
  "--chartreuse-400": "152 197 10",
  "--chartreuse-500": "135 177 3",
  "--chartreuse-600": "118 156 0",
  "--chartreuse-700": "103 136 0",
  "--yellow-400": "232 198 0",
  "--yellow-500": "215 179 0",
  "--yellow-600": "196 159 0",
  "--yellow-700": "176 140 0",
  "--magenta-400": "222 61 130",
  "--magenta-500": "200 34 105",
  "--magenta-600": "173 9 85",
  "--magenta-700": "142 0 69",
  "--fuchsia-400": "205 58 206",
  "--fuchsia-500": "182 34 183",
  "--fuchsia-600": "157 3 158",
  "--fuchsia-700": "128 0 129",
  "--purple-400": "157 87 244",
  "--purple-500": "137 61 231",
  "--purple-600": "115 38 211",
  "--purple-700": "93 19 183",
  "--indigo-400": "104 109 244",
  "--indigo-500": "82 88 228",
  "--indigo-600": "64 70 202",
  "--indigo-700": "50 54 168",
  "--seafoam-400": "0 161 154",
  "--seafoam-500": "0 140 135",
  "--seafoam-600": "0 119 114",
  "--seafoam-700": "0 99 95",
  "--red-100": "249 205 201",
  "--red-400": "234 56 41",
  "--red-500": "211 21 16",
  "--red-600": "180 0 0",
  "--red-700": "147 0 0",
  "--orange-400": "246 133 17",
  "--orange-500": "228 111 0",
  "--orange-600": "203 93 0",
  "--orange-700": "177 76 0",
  "--green-400": "0 143 93",
  "--green-500": "0 122 77",
  "--green-600": "0 101 62",
  "--green-700": "0 81 50",
  "--blue-100": "196 221 252",
  "--blue-400": "20 122 243",
  "--blue-500": "2 101 220",
  "--blue-600": "0 84 182",
  "--blue-700": "0 68 145",
  "--gray-50": "255 255 255",
  "--gray-75": "253 253 253",
  "--gray-100": "248 248 248",
  "--gray-200": "230 230 230",
  "--gray-300": "213 213 213",
  "--gray-400": "177 177 177",
  "--gray-500": "144 144 144",
  "--gray-600": "109 109 109",
  "--gray-700": "70 70 70",
  "--gray-800": "34 34 34",
  "--gray-900": "0 0 0",
  "--static-black": "29 29 29",
  "--static-white": "255 255 255",
  "--static-blue": "0 84 182",
  "--static-red": "180 0 0",
  "--static-blue-700": "0 68 145",
  "--static-red-700": "147 0 0"
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
  const otherTheme = Object.keys(Themes).filter((f) => f !== theme)[0];
  if (root.classList.contains(otherTheme)) {
    root.classList.replace(otherTheme, theme);
  } else {
    root.classList.add(theme);
  }

  // Object.keys(themeObject).forEach((property) => {
  //   if (property === "name") {
  //     return;
  //   }

  //   root.style.setProperty(property, themeObject[property]);
  // });
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
  "text-gray-400 hover:text-gray-700"
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
  "bg-gray-600 hover:bg-gray-700"
];

export function getRandomColors(): string {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
}

export function getRandomBgColors(): string {
  return randomBgColors[Math.floor(Math.random() * randomBgColors.length)];
}

const UserColors = ["celery", "chartreuse", "yellow", "magenta", "fuchsia", "purple", "indigo", "seafoam", "red", "orange", "green", "blue"];

export function getRandomColor(): string {
  return UserColors[Math.floor(Math.random() * UserColors.length)];
}

export function getGridLine(theme: string): string {
  return Themes[theme]["--gray-200"];
}

export function toRgba(hex: string, alpha: number) {
  return `rgba(${hex
    .substring(1)
    .match(/../g)
    .map((x) => +`0x${x}`)},${alpha})`;
}

export function getMutedColor(theme: string, name: string, opacity: number): string {
  if (name.length === 0) {
    return undefined;
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
  { label: "gray", value: "gray" },
  { label: "celery", value: "celery" },
  { label: "chartreuse", value: "chartreuse" },
  // { label: "yellow", value: "yellow" },
  { label: "magenta", value: "magenta" },
  { label: "fuchsia", value: "fuchsia" },
  { label: "purple", value: "purple" },
  { label: "indigo", value: "indigo" },
  { label: "seafoam", value: "seafoam" },
  { label: "red", value: "red" },
  { label: "orange", value: "orange" },
  { label: "green", value: "green" },
  { label: "blue", value: "blue" }
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
// bg-blue-400 bg-gray-400 bg-gray-400 border-orange-400 focus:ring-orange-500 focus:border-orange-500

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
