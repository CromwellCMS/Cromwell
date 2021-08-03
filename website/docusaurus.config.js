
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'My Site',
  url: 'https://cromwellcms.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo_icon_white.png',
  organizationName: 'CromwellCMS',
  projectName: 'CromwellCMS',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    prism: {
      theme: {
        "plain": {
          "color": "#d4d4d4",
          "backgroundColor": "#1e1e1e"
        },
        "styles": []
      },
    },
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'CromwellCMS Logo',
        src: 'img/logo_icon.png',
        srcDark: 'img/logo_icon_white.png',
      },
      items: [
        {
          to: '/docs/overview/intro',
          label: 'Docs',
          position: 'left',
          activeBasePath: 'never',
        },
        {
          to: '/docs/tutorials/theme-development',
          label: 'Tutorials',
          position: 'left',
          activeBasePath: 'docs/tutorials',
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
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://github.com/CromwellCMS/Cromwell/issues'
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
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CromwellCMS`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator: async function ({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);

            const backendItems = [];
            const commonItems = [];
            const frontendItems = [];

            const parseItems = (items) => {
              for (const item of items) {
                if (!item) continue;
                if (item.items && item.items.length) parseItems(item.items);

                if (item.id && item.id.startsWith('api/')) {
                  item.label = item.id.split('/');
                  item.label = item.label[item.label.length - 1];
                }

                if (!item.label) {
                  continue;
                }

                if (item.label.startsWith('backend.')) {
                  item.label = item.label.replace('backend.', '');
                  backendItems.push(item);
                }
                if (item.label.startsWith('common.')) {
                  item.label = item.label.replace('common.', '');
                  commonItems.push(item);
                }
                if (item.label.startsWith('frontend.')) {
                  item.label = item.label.replace('frontend.', '');
                  frontendItems.push(item);
                }
              }
            }
            parseItems(sidebarItems);

            return sidebarItems.map(item => {
              if (item.label === 'api') {
                item.label = 'API'
                item.items = [
                  {
                    "type": "category",
                    "label": "Backend",
                    collapsed: true,
                    items: [
                      {
                        "type": "doc",
                        "label": "summary",
                        "id": "api/modules/backend",
                        items: backendItems,
                        collapsed: true,
                      },
                      {
                        "type": "category",
                        "label": "classes",
                        items: backendItems,
                        collapsed: true,
                      }
                    ],
                  },
                  {
                    "type": "category",
                    "label": "Common",
                    collapsed: true,
                    items: [
                      {
                        "type": "doc",
                        "label": "summary",
                        "id": "api/modules/common",
                      },
                      {
                        "type": "category",
                        "label": "classes",
                        items: commonItems,
                        collapsed: true,
                      }
                    ],
                  },
                  {
                    "type": "category",
                    "label": "Frontend",
                    collapsed: true,
                    items: [
                      {
                        "type": "doc",
                        "label": "summary",
                        "id": "api/modules/frontend",
                      },
                      {
                        "type": "category",
                        "label": "classes",
                        items: frontendItems,
                        collapsed: true,
                      }
                    ],
                  },
                ];
              }
              return item;
            });
          },
          // editUrl: 'https://github.com/CromwellCMS/Cromwell/edit/master/website/docs/',
        },
        blog: {
          showReadingTime: true,
          // editUrl: 'https://github.com/CromwellCMS/Cromwell/edit/master/website/blog/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/syntax-highlight.css'),
          ]
        },
      },
    ],
  ],
};
