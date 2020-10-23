'use strict';

module.exports = {
    name: "cromwell-demoshop",
    type: 'theme',
    main: {
        themeName: "cromwell-demoshop",
        title: "Demoshop",
        previewImage: "/themes/cromwell-demoshop/shopping-cart.png",
        description: "Online shop theme",
        buildDir: "dist",
        pagesDir: "src/pages",
        adminPanelDir: "dist/adminPanel",
        palette: {
            "primaryColor": "#9900CC"
        },
        globalCss: [
            "react-toastify/dist/ReactToastify.css"
        ],
        headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap\" rel=\"stylesheet\" /><link href=\"https://unpkg.com/reset-css/reset.css\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\"><meta property=\"og:appConfig_headHtml\" content=\"blah_blah\" key=\"blah_blah\" />"
    },
    pages: [
        {
            "route": "index",
            "name": "Home page",
            "title": "Home page",
            "modifications": [
                {
                    "type": "gallery",
                    "componentId": "main_gallery_01",
                    "gallery": {
                        "images": [
                            {
                                "src": "/themes/cromwell-demoshop/main_banner_1.png",
                                "href": "/pages/some_page"
                            },
                            {
                                "src": "/themes/cromwell-demoshop/main_banner_2.png",
                                "href": "/pages/some_page"
                            },
                            {
                                "src": "/themes/cromwell-demoshop/main_banner_3.png",
                                "href": "/pages/some_page"
                            },
                            {
                                "src": "/themes/cromwell-demoshop/main_banner_4.png",
                                "href": "/pages/some_page"
                            }
                        ],
                        "width": "100%",
                        "ratio": 3.75,
                        "showPagination": true
                    }
                },
                {
                    "type": "plugin",
                    "componentId": "main_showcase",
                    "plugin": {
                        "pluginName": "ProductShowcase"
                    }
                }
            ]
        },
        {
            "route": "category/[slug]",
            "name": "Product category page",
            "title": "Product category page",
            "isDynamic": true,
            "modifications": [
                {
                    "type": "plugin",
                    "componentId": "Category_ProductFilter_Plugin",
                    "destinationComponentId": "Category_ProductFilter",
                    "destinationPosition": "after",
                    "isVirtual": true,
                    "plugin": {
                        "pluginName": "ProductFilter"
                    }
                }
            ]
        },
        {
            "route": "product/[slug]",
            "name": "Product page",
            "title": "Product page",
            "isDynamic": true,
            "modifications": [
                {
                    "type": "plugin",
                    "componentId": "Product_ProductShowcase_Plugin",
                    "destinationComponentId": "Product_ProductShowcase",
                    "destinationPosition": "after",
                    "isVirtual": true,
                    "plugin": {
                        "pluginName": "ProductShowcase"
                    }
                }
            ]
        },
        {
            "route": "pages/some_page",
            "name": "Custom page",
            "title": "Some custom page",
            "modifications": [
                {
                    "type": "plugin",
                    "componentId": "5",
                    "plugin": {
                        "pluginName": "ProductShowcase"
                    }
                },
                {
                    "type": "HTML",
                    "componentId": "1",
                    "destinationComponentId": "2",
                    "destinationPosition": "after"
                },
                {
                    "type": "plugin",
                    "componentId": "111",
                    "destinationComponentId": "2",
                    "destinationPosition": "after",
                    "isVirtual": true,
                    "styles": "background: red;",
                    "plugin": {
                        "pluginName": "ProductShowcaseDemo"
                    }
                }
            ]
        }
    ],
    themeCustomConfig: {
        "store": {},
        "header": {
            "logo": "/themes/cromwell-demoshop/shopping-cart.png",
            "contactPhone": "+123 (456) 78-90",
            "welcomeMessage": "Welcome message",
            "topLinks": [
                {
                    "title": "Contact us",
                    "href": "/contact-us"
                },
                {
                    "title": "Blog",
                    "href": "/blog"
                },
                {
                    "title": "Sign in",
                    "href": "/sign-in"
                }
            ]
        },
        "product": {
            "customTabs": [
                {
                    "label": "Custom tab",
                    "html": "<div><p>Custom tab</p></div>"
                }
            ]
        }
    }
};