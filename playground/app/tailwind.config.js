/* eslint-disable no-undef */
const defaultTheme = require("tailwindcss/defaultTheme");
const fs = require("fs");

function addColors() {
  const colors = [
    "gray",
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
    "blue",
  ];

  const output = [];
  const coloredWeights = [400, 500, 600, 700];
  const brandColoredWeights = [100, 400, 500, 600, 700];
  const blackWeights = [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const shapes = ["text", "stroke", "border", "bg", "ring", "from", "to"];
  const prefixes = ["", "hover:", "focus:"];

  const builtColors = colors.reduce((allColors, color) => {
    const out = [];
    allColors[color] = {};
    // not all colors are created equal.
    const weights = (color === "gray") ? blackWeights : ["blue","red"].includes(color) ? brandColoredWeights : coloredWeights;
    for(const weight of weights) {
      allColors[color][weight] = withOpacityValue(`--${color}-${weight}`);
      for(const prefix of prefixes) {
        for(const shape of shapes) {
          out.push(`${prefix}${shape}-${color}-${weight}`);
        }
      }
    }
    output.push(out.join(" "));
    return allColors;
  }, {
      transparent: "transparent",
      currentColor: "currentColor",
      white: withOpacityValue("--gray-50"),
      black: withOpacityValue("--gray-800"),
      static: {
        black: withOpacityValue("--black"),
        white: withOpacityValue("--white"),
      },
      cta: {
        default: withOpacityValue("--blue-600"),
        hover: withOpacityValue("--blue-700"),
        light: withOpacityValue("--blue-100")
      },
      primary: {
        default: withOpacityValue("--gray-800"),
        hover: withOpacityValue("--gray-900"),
        light: withOpacityValue("--gray-300")
      },
      secondary: {
        default: withOpacityValue("--gray-300"),
        hover: withOpacityValue("--gray-400"),
        light: withOpacityValue("--gray-200")
      },
      negative: {
        default: withOpacityValue("--red-600"),
        hover: withOpacityValue("--red-700"),
        light: withOpacityValue("--red-100")
      }
    }
  );
  fs.writeFileSync("./tailwind.colors.md", output.join("\n\n"));
  return builtColors;
}

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
    "./tailwind.colors.md"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ubuntu", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateAreas: {
        "layout": [
          "header header",
          "aside nav",
          "aside main",
        ],
        "workspaces": [
          "cards"
        ]
      },
      gridTemplateColumns: {
        "layout": "226px 1fr",
        "workspaces": "repeat(auto-fill, 208px)"
      },
      gridTemplateRows: {
        "layout": `42px
                   56px
                   1fr`,
        "workspaces": "repeat(auto-fill, 256px)"
      }
    },
    colors: addColors()
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@savvywombat/tailwindcss-grid-areas"),
  ]
};
