module.exports = {
    palette: {
        primaryColor: '#9900CC',
    },
    globalCss: [
        "react-toastify/dist/ReactToastify.css",
        '../styles/global.scss'
    ],
    headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;900&display=swap\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\">",
    rollupConfig: () => {
        const commonjs = require('@rollup/plugin-commonjs');
        const json = require('@rollup/plugin-json');
        const typescript = require('rollup-plugin-ts-compiler');

        // All plugins below will be instantiated for every output options (pages, admin panel, etc)
        // But rollup-plugin-ts-compiler with shared state object will have only one instance across all compilations.
        // We can do that only if we don't need to use different tsconfigs for outputs.
        // Shared state will decrease compile time in N times for every output. 
        const tsSharedState = {};

        const getDefaultPlugins = () => [
            typescript({
                sharedState: tsSharedState,
                monorepo: true,
            }),
            commonjs(),
            json(),
        ];

        return {
            main: {
                plugins: [
                    ...getDefaultPlugins(),
                ]
            },
        }
    },
    defaultPages: {
        index: 'index',
        category: 'category/[slug]',
        product: 'product/[slug]',
        post: 'blog/[slug]',
        tag: 'tag/[slug]',
        pages: 'pages/[slug]',
        account: 'account',
    },
    pages: [
        {
            id: "index",
            route: "index",
            name: "Home",
            title: "Home page",
            modifications: [
                {
                    "type": "gallery",
                    "id": "main_gallery_01",
                    "gallery": {
                        "images": [
                            {
                                "src": "/themes/@cromwell/theme-store/main_banner_1.png",
                                "href": "/pages/some_page"
                            },
                            {
                                "src": "/themes/@cromwell/theme-store/main_banner_2.png",
                                "href": "/pages/some_page"
                            },
                            {
                                "src": "/themes/@cromwell/theme-store/main_banner_3.png",
                                "href": "/pages/some_page"
                            },
                            {
                                "src": "/themes/@cromwell/theme-store/main_banner_4.png",
                                "href": "/pages/some_page"
                            }
                        ],
                        "width": "100%",
                        "ratio": 3.75,
                        "pagination": true,
                        "effect": "coverflow",
                        "loop": true,
                        "delay": 2222,
                        "speed": 800
                    }
                },
                {
                    "type": "plugin",
                    "id": "main_showcase",
                    "plugin": {
                        "pluginName": "@cromwell/plugin-product-showcase"
                    }
                }
            ]
        },
        {
            id: "category/[slug]",
            route: "category/[slug]",
            name: "Product category",
            modifications: [
                {
                    "type": "plugin",
                    "id": "Category_ProductFilter_Plugin",
                    "parentId": "Category_ProductFilter",
                    "isVirtual": true,
                    "plugin": {
                        "pluginName": "@cromwell/plugin-product-filter"
                    }
                }
            ]
        },
        {
            id: "product/[slug]",
            route: "product/[slug]",
            name: "Product",
            modifications: [
                {
                    "type": "plugin",
                    "id": "Product_ProductShowcase_Plugin",
                    "parentId": "Product_ProductShowcase",
                    "style": { height: '440px' },
                    "index": 2,
                    "isVirtual": true,
                    "plugin": {
                        "pluginName": "@cromwell/plugin-product-showcase"
                    }
                }
            ],
        },
        {
            id: "blog/[slug]",
            route: "blog/[slug]",
            name: "Blog post",
        },
        {
            id: "blog",
            route: "blog",
            name: "Blog",
            title: "Blog page",
        },
        {
            id: "tag/[slug]",
            route: "tag/[slug]",
            name: "Blog tags",
        },
        {
            id: "404",
            route: "404",
            name: "404",
            title: "404 page",
        },
        {
            id: "checkout",
            route: "checkout",
            name: "checkout",
            title: "checkout page",
        },
        {
            id: "pages/shipping",
            route: "pages/shipping",
            name: "Shipping and Delivery",
            title: "Shipping and Delivery",
            isVirtual: true,
            modifications: [
                {
                    "id": "shipping_content",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage_content",
                    "index": 0,
                    "style": {
                        "margin": "40px 0",
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>Shipping and Delivery</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<ul>\n<li><p><strong>1.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>2.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>3.</strong> Lorem ipsum dolor sit amet</p></li>\n</ul>"
                    }
                },
            ]
        },
        {
            id: "pages/returns",
            route: "pages/returns",
            name: "Returns",
            title: "Returns",
            isVirtual: true,
            modifications: [
                {
                    "id": "returns_content",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage_content",
                    "index": 0,
                    "style": {
                        "margin": "40px 0",
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>Returns</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<ul>\n<li><p><strong>1.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>2.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>3.</strong> Lorem ipsum dolor sit amet</p></li>\n</ul>"
                    }
                },
            ]
        },
        {
            id: "pages/gift-cards",
            route: "pages/gift-cards",
            name: "Gift cards",
            title: "Gift cards",
            isVirtual: true,
            modifications: [
                {
                    "id": "gift-cards_content",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage_content",
                    "index": 0,
                    "style": {
                        "margin": "40px 0",
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>Gift cards</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<ul>\n<li><p><strong>1.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>2.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>3.</strong> Lorem ipsum dolor sit amet</p></li>\n</ul>"
                    }
                },
            ]
        },
        {
            id: "pages/news",
            route: "pages/news",
            name: "News",
            title: "News",
            isVirtual: true,
            modifications: [
                {
                    "id": "news_content",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage_content",
                    "index": 0,
                    "style": {
                        "margin": "40px 0",
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>News</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<ul>\n<li><p><strong>1.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>2.</strong>  Lorem ipsum dolor sit amet</p></li>\n<li><p><strong>3.</strong> Lorem ipsum dolor sit amet</p></li>\n</ul>"
                    }
                },
            ]
        },
        {
            id: "pages/contact-us",
            route: "pages/contact-us",
            name: "Contact us",
            title: "Contact us",
            isVirtual: true,
            modifications: [
                {
                    "id": "contacts_content",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage_content",
                    "index": 0,
                    "style": {
                        "margin": "40px 0",
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>Contact Information</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<ul>\n<li><p><strong>Email:</strong> contact@example.com</p></li>\n<li><p><strong>Phone:</strong> +1 (234) 567-89-00</p></li>\n<li><p><strong>Address:</strong> Lorem ipsum dolor sit amet</p></li>\n</ul>"
                    }
                },
            ]
        },
        {
            id: "pages/attribution",
            route: "pages/attribution",
            name: "Attribution",
            isVirtual: true,
            modifications: [
                {
                    "id": "contacts_content",
                    "type": "HTML",
                    "isVirtual": true,
                    "parentId": "PagesGenericPage_content",
                    "index": 0,
                    "style": {
                        "margin": "40px 0",
                        "padding": "20px",
                        "backgroundColor": "#fff",
                        "borderRadius": "5px"
                    },
                    "html": {
                        "innerHTML": "<h1>Attribution</h1><div id=\"icons_attribution\" style={{ fontSize: '12px' }}>Icons made by <a href=\"http://www.freepik.com/\" title=\"Freepik\">Freepik</a>, <a href=\"https://www.flaticon.com/authors/kiranshastry\" title=\"Kiranshastry\">Kiranshastry</a>, <a href=\"https://www.flaticon.com/authors/roundicons\" title=\"Roundicons\">Roundicons</a>, <a href=\"https://www.flaticon.com/authors/monkik\" title=\"monkik\">monkik</a>, <a href=\"https://www.flaticon.com/authors/itim2101\" title=\"itim2101\">itim2101</a>, <a href=\"https://creativemarket.com/eucalyp\" title=\"Eucalyp\">Eucalyp</a>  from <a href=\"https://www.flaticon.com/\" title=\"Flaticon\"> www.flaticon.com</a>; <a href=\"https://www.vecteezy.com/free-vector/banner-cdr\">Banner Cdr Vectors by Vecteezy</a>; <a href=\"https://www.vecteezy.com/free-vector/banner\">Banner Vectors by Vecteezy</a></div>"
                    }
                },
            ]
        }
    ],
    globalModifications: [
        {
            "type": "plugin",
            "id": "header_main_menu",
            "plugin": {
                "pluginName": "@cromwell/plugin-main-menu"
            }
        }
    ]
};