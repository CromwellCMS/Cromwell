/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Cromwell CMS',
  url: 'https://cromwellcms.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon_small.png',
  organizationName: 'Cromwell CMS',
  projectName: 'Cromwell CMS',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl: 'https://github.com/CromwellCMS/Cromwell/edit/master/website/blog/',
          sidebarItemsGenerator: require('./sidebarItemsGenerator'),
        },
        blog: {
          showReadingTime: true,
          // editUrl: 'https://github.com/CromwellCMS/Cromwell/edit/master/website/docs/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/syntax-highlight.css'),
            require.resolve('./src/css/custom.css'),
          ],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Cromwell CMS',
        logo: {
          alt: 'Logo',
          src: 'img/logo_small_black.svg',
          srcDark: 'img/logo_small_white.svg',
        },
        items: [
          {
            to: '/docs/overview/intro',
            label: 'Installation',
            position: 'left',
            activeBasePath: 'never',
          },
          {
            to: '/docs/development/theme-development',
            label: 'Development',
            position: 'left',
            activeBasePath: 'docs/development',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/CromwellCMS/Cromwell',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Overview',
                to: '/docs/overview/intro',
              },
              {
                label: 'Features',
                to: '/docs/features/overview',
              },
              {
                label: 'Development',
                to: '/docs/development/theme-development',
              },
              {
                label: 'Frontend dependencies',
                to: '/latest-frontend-dependencies',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/mxmJNSZ2gn'
              },
              {
                label: 'Issues',
                href: 'https://github.com/CromwellCMS/Cromwell/issues'
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/CromwellCMS/Cromwell',
              },
              {
                label: 'Contacts',
                href: '/contacts'
              },
              {
                label: 'Funding',
                href: '/funding'
              },
              {
                label: 'Attribution',
                href: '/attribution'
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Cromwell CMS`,
      },
      // prism: {
      //   theme: lightCodeTheme,
      //   darkTheme: darkCodeTheme,
      // },
      prism: {
        theme: {
          "plain": {
            "color": "#d4d4d4",
            "backgroundColor": "#1e1e1e"
          },
          "styles": []
        },
        darkTheme: {
          "plain": {
            "color": "#d4d4d4",
            "backgroundColor": "#1e1e1e"
          },
          "styles": []
        }
      },
    }),
});
