module.exports = {
  rollupConfig: () => {
    const commonjs = require('@rollup/plugin-commonjs');
    const { terser } = require('rollup-plugin-terser');
    const typescript = require('rollup-plugin-ts-compiler');
    return {
      main: {
        plugins: [
          typescript(),
          commonjs(),
          terser({
            compress: {
              side_effects: false,
              negate_iife: false,
            },
          }),
        ],
      },
    };
  },
  defaultSettings: {
    items: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Category 1',
        href: '/category/1',
        sublinks: [
          {
            title: 'Subcategory 2',
            href: '/category/2',
          },
          {
            title: 'Subcategory 3',
            href: '/category/3',
          },
          {
            title: 'Subcategory 4',
            href: '/category/4',
          },
        ],
      },
      {
        title: 'Category 5',
        href: '/category/5',
        sublinks: [
          {
            title: 'Subcategory 6',
            href: '/category/6',
          },
          {
            title: 'Subcategory 7',
            href: '/category/7',
          },
          {
            title: 'Subcategory 7',
            href: '/category/7',
          },
        ],
      },
      {
        title: 'Pages',
        sublinks: [
          {
            title: 'Contact us',
            href: '/pages/contact-us',
          },
          {
            title: 'FAQ',
            href: '/pages/faq',
          },
        ],
      },
      {
        title: 'Sale!',
        href: '/category/1',
      },
      {
        title: 'Blog',
        href: '/blog',
      },
    ],
  },
};
