const docs = require("./docs");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Valkyr",
  tagline: "A collection of tools for building applications using web based technologies",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "kodemon/valkyr",
  projectName: "valkyr",

  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/github"),
      darkTheme: require("prism-react-renderer/themes/dracula"),
    },
    navbar: {
      title: "Valkyr",
      logo: {
        alt: "Valkyr Site Logo",
        src: "img/logo.png",
      },
      items: [
        ...docs.map(doc => ({
          to: doc,
          activeBasePath: doc,
          label: capitalizeFirstLetter(doc),
          position: "left"
        })),
        {
          href: "https://github.com/kodemon/valkyr",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/kodemon/valkyr",
            },
          ],
        },
      ]
    }
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],

  plugins: [
    ...docs.map(doc => ([
      "@docusaurus/plugin-content-docs",
      {
        id: doc,
        path: `../packages/${doc}/docs`,
        routeBasePath: doc,
        editUrl: "https://github.com/kodemon/valkyr/tree/main/docs",
        sidebarCollapsed: false
      }
    ]))
  ]
};

module.exports = config;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}