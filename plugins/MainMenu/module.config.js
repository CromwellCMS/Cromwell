module.exports = {
    type: "plugin",
    title: "Main menu",
    adminInputFile: "src/admin/index.tsx",
    frontendInputFile: "src/frontend/index.tsx",
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const { terser } = require('rollup-plugin-terser');
        const typescript = require('rollup-plugin-typescript2');
        return {
            main: {
                plugins: [
                    commonjs(),
                    typescript(),
                    // terser()
                ]
            }
        }
    },
    defaultSettings: {
        items: [
            {
                title: 'Home',
                href: '/'
            },
            {
                title: 'Category 1',
                href: '/category/1',
                sublinks: [
                    {
                        title: "Subcategory 2",
                        href: '/category/2'
                    },
                    {
                        title: "Subcategory 3",
                        href: '/category/3'
                    },
                    {
                        title: "Subcategory 4",
                        href: '/category/4'
                    }
                ]
            },
            {
                title: 'Category 5',
                href: '/category/5',
                sublinks: [
                    {
                        title: "Subcategory 6",
                        href: '/category/6'
                    },
                    {
                        title: "Subcategory 7",
                        href: '/category/7'
                    },
                    {
                        title: "Subcategory 7",
                        href: '/category/7'
                    }
                ]
            },
            {
                title: 'Pages',
                sublinks: [
                    {
                        title: "About us",
                        href: '/about_us'
                    },
                    {
                        title: "Contact us",
                        href: '/contact_us'
                    },
                    {
                        title: "FAQ",
                        href: '/faq'
                    }
                ]
            },
            {
                title: "Sale!",
                href: '/sale'
            },
            {
                title: 'Blog',
                href: '/'
            }
        ]
    }
}