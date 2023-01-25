// /* eslint-disable no-undef */
// const defaultTheme = require("tailwindcss/defaultTheme");
// const fs = require("fs");
// function addColors() {
//   const colors = [
//     "gray",
//     "celery",
//     "chartreuse",
//     "yellow",
//     "magenta",
//     "fuchsia",
//     "purple",
//     "indigo",
//     "seafoam",
//     "red",
//     "orange",
//     "green",
//     "blue",
//   ];

//   const output = ["bg-static-black"];
//   const coloredWeights = [400, 500, 600, 700];
//   const brandColoredWeights = [100, 400, 500, 600, 700];
//   const blackWeights = [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900];
//   const shapes = ["text", "stroke", "border", "bg", "ring", "from", "to"];
//   const prefixes = ["", "group-hover:", "hover:", "focus:"];

//   const builtColors = colors.reduce((allColors, color) => {
//     const out = [];
//     allColors[color] = {};
//     // not all colors are created equal.
//     const weights = (color === "gray") ? blackWeights : ["blue","red"].includes(color) ? brandColoredWeights : coloredWeights;
//     for(const weight of weights) {
//       allColors[color][weight] = withOpacityValue(`--${color}-${weight}`);
//       for(const prefix of prefixes) {
//         for(const shape of shapes) {
//           out.push(`${prefix}${shape}-${color}-${weight}`);
//         }
//       }
//     }
//     output.push(out.join(" "));
//     return allColors;
//   }, {
//       transparent: "transparent",
//       currentColor: "currentColor",
//       white: withOpacityValue("--gray-50"),
//       black: withOpacityValue("--gray-800"),
//       static: {
//         black: withOpacityValue("--static-black"),
//         white: withOpacityValue("--static-white"),
//       },
//       cta: {
//         static: withOpacityValue("--static-blue"),
//         "static-hover": withOpacityValue("--static-blue-700"),
//         default: withOpacityValue("--blue-600"),
//         hover: withOpacityValue("--blue-700"),
//         light: withOpacityValue("--blue-100")
//       },
//       primary: {
//         default: withOpacityValue("--gray-800"),
//         hover: withOpacityValue("--gray-900"),
//         light: withOpacityValue("--gray-300")
//       },
//       secondary: {
//         default: withOpacityValue("--gray-300"),
//         hover: withOpacityValue("--gray-400"),
//         light: withOpacityValue("--gray-200")
//       },
//       negative: {
//         static: withOpacityValue("--static-red"),
//         "static-hover": withOpacityValue("--static-red-500"),
//         default: withOpacityValue("--red-400"),
//         hover: withOpacityValue("--red-500"),
//         light: withOpacityValue("--red-100"),
//         outlineHover: withOpacityValue("--red-700"),
//       }
//     }
//   );
//   fs.writeFileSync(`${__dirname}/tailwind.colors.md`, output.join("\n\n"));
//   return builtColors;
// }

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

// module.exports = {
//   content: [
//     "./src/**/*.{tsx,ts,css}",
//     "./tailwind.colors.md",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["Inter var", ...defaultTheme.fontFamily.sans],
//         serif: ["matrix-ii", ...defaultTheme.fontFamily.serif],
//         app: ["Merriweather", ...defaultTheme.fontFamily.sans],
//         hand: ["marydale", ...defaultTheme.fontFamily.sans]
//       },
//       spacing: {
//         modal: "32rem"
//       }
//     },
//     colors: addColors(),
//     fluidType: {
//       settings: {
//         fontSizeMin: 1, // 1.125rem === 18px
//         fontSizeMax: 2, // 1.25rem === 20px
//         ratioMin: 1, // Multiplicator Min
//         ratioMax: 1.5, // Multiplicator Max
//         screenMin: 20, // 20rem === 320px
//         screenMax: 96, // 96rem === 1536px
//         unit: "rem",
//         prefix: "app-"
//       },
//       values: {
//         "xs": [-2, 1.4],
//         "sm": [-1, 1.25],
//         "base": [0, 1.6],
//         "lg": [1, 1.6],
//         "xl": [1.5, 1.2],
//         "2xl": [2, 1.2],
//         "3xl": [3, 0.62],
//         "4xl": [4, 1],
//         "5xl": [5, 1.1],
//         "6xl": [6, 1.1],
//         "7xl": [7, 1],
//         "8xl": [8, 1],
//         "9xl": [9, 1],
//       }      
//     }
//   },
//   plugins: [
//     require("@tailwindcss/aspect-ratio"),
//     require("tailwindcss-fluid-type"),
//     require("tailwind-scrollbar-hide")
//   ]
// };


// const drac = require("tailwind-dracula");
// const colors = drac().config.theme.extend.colors();
module.exports = {
  content: [
    "./src/**/*.{tsx,ts,css}",
    "./tailwind.colors.md",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        currentColor: "currentColor",
        white: "#fff",
        black: "#000",
        back: "#282c34",
        
        cta: {
          static: withOpacityValue("--static-blue"),
          "static-hover": withOpacityValue("--static-blue-700"),
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
          static: withOpacityValue("--static-red"),
          "static-hover": withOpacityValue("--static-red-500"),
          default: withOpacityValue("--red-400"),
          hover: withOpacityValue("--red-500"),
          light: withOpacityValue("--red-100"),
          outlineHover: withOpacityValue("--red-700"),
        }        
      }
    }
  },
  plugins: [
    require("tailwind-dracula")(),
  ]
};