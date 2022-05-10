import { Injectable } from "@angular/core";

export type SelectOption = {
  Icon?: ({ size }: { size: number }) => string;
  label: string;
  value: string;
};
export type SelectOptions = SelectOption[];

const lightHex = {
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
  "--black-50": "#ffffff",
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

const light = {
  "--celery-100": "217 240 220",
  "--celery-400": "68 181 86",
  "--celery-500": "61 167 78",
  "--celery-600": "55 153 71",
  "--celery-700": "49 139 64",
  "--chartreuse-100": "230 245 217",
  "--chartreuse-400": "133 208 68",
  "--chartreuse-500": "124 195 63",
  "--chartreuse-600": "115 181 58",
  "--chartreuse-700": "106 168 52",
  "--yellow-100": "255 246 197",
  "--yellow-400": "223 191 0",
  "--yellow-500": "210 178 0",
  "--yellow-600": "196 166 0",
  "--yellow-700": "183 153 0",
  "--magenta-100": "247 215 232",
  "--magenta-400": "216 55 144",
  "--magenta-500": "206 39 131",
  "--magenta-600": "188 28 116",
  "--magenta-700": "174 14 102",
  "--fuchsia-100": "242 215 244",
  "--fuchsia-400": "192 56 204",
  "--fuchsia-500": "177 48 189",
  "--fuchsia-600": "162 40 173",
  "--fuchsia-700": "147 33 158",
  "--purple-100": "233 221 247",
  "--purple-400": "146 86 217",
  "--purple-500": "134 76 204",
  "--purple-600": "122 66 191",
  "--purple-700": "111 56 177",
  "--indigo-100": "224 224 251",
  "--indigo-400": "103 103 236",
  "--indigo-500": "92 92 224",
  "--indigo-600": "81 81 211",
  "--indigo-700": "70 70 198",
  "--seafoam-100": "199 243 245",
  "--seafoam-400": "27 149 154",
  "--seafoam-500": "22 135 140",
  "--seafoam-600": "15 121 125",
  "--seafoam-700": "9 108 111",
  "--red-100": "249 218 220",
  "--red-400": "227 72 80",
  "--red-500": "215 55 63",
  "--red-600": "201 37 45",
  "--red-700": "187 18 26",
  "--orange-100": "250 230 209",
  "--orange-400": "230 134 25",
  "--orange-500": "218 123 17",
  "--orange-600": "203 111 16",
  "--orange-700": "189 100 13",
  "--green-100": "207 241 229",
  "--green-400": "45 157 120",
  "--green-500": "38 142 108",
  "--green-600": "18 128 92",
  "--green-700": "16 113 84",
  "--blue-100": "211 229 251",
  "--blue-400": "38 128 235",
  "--blue-500": "20 115 230",
  "--blue-600": "13 102 208",
  "--blue-700": "9 90 186",
  "--black-50": "255 255 255",
  "--black-75": "250 250 250",
  "--black-100": "245 245 245",
  "--black-200": "234 234 234",
  "--black-300": "225 225 225",
  "--black-400": "202 202 202",
  "--black-500": "179 179 179",
  "--black-600": "142 142 142",
  "--black-700": "110 110 110",
  "--black-800": "75 75 75",
  "--black-900": "44 44 44"
};

const darkHex = {
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

const dark = {
  "--celery-400": "61 167 78",
  "--celery-500": "68 181 86",
  "--celery-600": "75 195 95",
  "--celery-700": "81 210 103",
  "--chartreuse-400": "124 195 63",
  "--chartreuse-500": "133 208 68",
  "--chartreuse-600": "142 222 73",
  "--chartreuse-700": "155 236 84",
  "--yellow-400": "210 178 0",
  "--yellow-500": "223 191 0",
  "--yellow-600": "237 204 0",
  "--yellow-700": "250 217 0",
  "--magenta-400": "202 41 150",
  "--magenta-500": "216 55 144",
  "--magenta-600": "226 73 157",
  "--magenta-700": "236 90 170",
  "--fuchsia-400": "177 48 189",
  "--fuchsia-500": "192 56 204",
  "--fuchsia-600": "207 62 220",
  "--fuchsia-700": "217 81 229",
  "--purple-400": "134 76 204",
  "--purple-500": "146 86 217",
  "--purple-600": "157 100 225",
  "--purple-700": "168 115 223",
  "--indigo-400": "92 92 224",
  "--indigo-500": "103 103 236",
  "--indigo-600": "117 117 241",
  "--indigo-700": "130 130 246",
  "--seafoam-400": "22 135 140",
  "--seafoam-500": "27 149 154",
  "--seafoam-600": "32 163 168",
  "--seafoam-700": "35 178 184",
  "--red-400": "215 55 63",
  "--red-500": "227 72 80",
  "--red-600": "236 91 98",
  "--red-700": "247 109 116",
  "--orange-400": "218 123 17",
  "--orange-500": "230 134 25",
  "--orange-600": "242 148 35",
  "--orange-700": "249 164 63",
  "--green-400": "38 142 108",
  "--green-500": "45 157 120",
  "--green-600": "51 171 132",
  "--green-700": "57 185 144",
  "--blue-400": "20 115 230",
  "--blue-500": "38 128 235",
  "--blue-600": "55 142 240",
  "--blue-700": "75 156 245",
  "--black-50": "8 8 8",
  "--black-75": "26 26 26",
  "--black-100": "30 30 30",
  "--black-200": "44 44 44",
  "--black-300": "57 57 57",
  "--black-400": "73 73 73",
  "--black-500": "92 92 92",
  "--black-600": "124 124 124",
  "--black-700": "162 162 162",
  "--black-800": "200 200 200",
  "--black-900": "239 239 239"
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

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  public currentTheme: string;

  constructor() {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    this.currentTheme = localStorage["theme"] || (mq.matches ? "dark" : "light");
  }

  toggleTheme() {
    if (this.currentTheme === "light") {
      this.applyTheme("dark");
    } else {
      this.applyTheme("light");
    }
  }

  applyTheme(theme: string) {
    const themeObject: IMappedTheme = Themes[theme];
    if (!themeObject) return;

    const root = document.documentElement;

    Object.keys(themeObject).forEach((property) => {
      if (property === "name") {
        return;
      }

      root.style.setProperty(property, themeObject[property]);
    });
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  }
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
  { label: "gray", value: "gray" },
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
