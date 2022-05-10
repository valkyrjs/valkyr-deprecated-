/* eslint-disable no-undef */
const defaultTheme = require("tailwindcss/defaultTheme");
const fs = require("fs");

function addColors() {
  const colors = [
    "black",
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

  const output = [`// generated ${new Date().toString()}`];
  const coloredWeights = [100, 400, 500, 600, 700];
  const blackWeights = [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const shapes = ["text", "stroke", "border", "bg", "ring", "from", "to"];
  const prefixes = ["", "hover:", "focus:"];

  const builtColors = colors.reduce((allColors, color) => {
    const out = [];
    allColors[color] = {};
    const weights = (color === "black") ? blackWeights : coloredWeights;
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
      white: withOpacityValue("--black-50"),
      primary: "var(--blue-400)",
      "primary-muted": "var(--blue-400)",
      "primary-light": "#0469e3",
      "primary-dark": "#0057be",
  });
  fs.writeFileSync("tailwind.colors.md", output.join("\n\n"));
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
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
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
      },    
      colors: addColors()
    },    
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@savvywombat/tailwindcss-grid-areas"),
  ]
};
