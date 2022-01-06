/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Valkyr',
  tagline: 'One way to build applications',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'kodemon/valkyr',
  projectName: 'valkyr',

  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: 'Valkyr',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'access',
          activeBasePath: 'access',
          label: 'Access',
          position: 'left'
        },
        {
          to: 'auth',
          activeBasePath: 'auth',
          label: 'Auth',
          position: 'left'
        },
        {
          to: 'db',
          activeBasePath: 'db',
          label: 'DB',
          position: 'left'
        },
        {
          to: 'event-store',
          activeBasePath: 'event-store',
          label: 'Event Store',
          position: 'left'
        },
        {
          to: 'router',
          activeBasePath: 'router',
          label: 'Router',
          position: 'left'
        },
        {
          to: 'server',
          activeBasePath: 'server',
          label: 'Server',
          position: 'left'
        },
        {
          to: 'socket',
          activeBasePath: 'socket',
          label: 'Socket',
          position: 'left'
        },
        {
          href: 'https://github.com/kodemon/valkyr',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/kodemon/valkyr',
            },
          ],
        },
      ]
    }
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'access',
        path: '../docs/access',
        routeBasePath: 'access',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'auth',
        path: '../docs/auth',
        routeBasePath: 'auth',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'db',
        path: '../docs/db',
        routeBasePath: 'db',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'event-store',
        path: '../docs/event-store',
        routeBasePath: 'event-store',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'router',
        path: '../docs/router',
        routeBasePath: 'router',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'server',
        path: '../docs/server',
        routeBasePath: 'server',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'socket',
        path: '../docs/socket',
        routeBasePath: 'socket',
        editUrl: 'https://github.com/kodemon/valkyr/tree/main/docs',
        sidebarCollapsed: false
      }
    ]
  ]
};

module.exports = config;
