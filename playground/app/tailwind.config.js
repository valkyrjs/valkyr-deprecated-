const defaultTheme = require("tailwindcss/defaultTheme")

function addColors() {
  const colors = [
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
  const weights = [100, 400, 500, 600, 700];
  const shapes = ["text", "stroke", "border", "bg", "ring", "from", "to"];
  const prefixes = ["", "hover:", "focus:"];

  const builtColors = colors.reduce((allColors, color) => {
    allColors[color] = {};
    for(const weight of weights) {
      allColors[color][weight] = `var(--${color}-${weight})`
      for(const prefix of prefixes) {
        for(const shape of shapes) {
          output.push(`${prefix}${shape}-${color}-${weight}`);
        }
      }
    }
    return allColors;
  }, {
      transparent: "transparent",
      white: "var(--gray-50)",
      black: "var(--gray-900)",
      primary: "var(--blue-400)",
      "primary-muted": "var(--blue-400)",
      "primary-light": "#0469e3",
      "primary-dark": "#0057be",
      c: {
        50: "var(--gray-50)",
        75: "var(--gray-75)",
        100: "var(--gray-100)",
        200: "var(--gray-200)",
        300: "var(--gray-300)",
        400: "var(--gray-400)",
        500: "var(--gray-500)",
        600: "var(--gray-600)",
        700: "var(--gray-700)",
        800: "var(--gray-800)",
        900: "var(--gray-900)"
      }    
  });
  // console.log(output.join(" "));
  return builtColors;
}

module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
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

