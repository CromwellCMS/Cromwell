module.exports = {
  palette: {
    primaryColor: '#9900CC',
  },
  globalCss: [
    'react-toastify/dist/ReactToastify.css',
    './src/styles/global.scss',
    '@cromwell/toolkit-commerce/dist/_index.css'
  ],
  headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;900&display=swap\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\">",
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
                "href": "/category/5"
              },
              {
                "src": "/themes/@cromwell/theme-store/main_banner_2.png",
                "href": "/category/6"
              },
              {
                "src": "/themes/@cromwell/theme-store/main_banner_3.png",
                "href": "/category/7"
              },
              {
                "src": "/themes/@cromwell/theme-store/main_banner_4.png",
                "href": "/category/8"
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
      id: "product/[slug]",
      route: "product/[slug]",
      name: "Product",
      modifications: [
        {
          "type": "plugin",
          "id": "Product_ProductShowcase",
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
      name: "Blog tag",
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
      id: "pages/faq",
      route: "pages/faq",
      name: "FAQ",
      title: "FAQ",
      isVirtual: true,
      modifications: [
        {
          "id": "faq_content",
          "jsxParentId": "PagesGenericPage_content",
          "type": "editor",
          "isVirtual": true,
          "style": {
            "minWidth": "50px",
            "minHeight": "30px",
            "backgroundColor": "#ffffff",
            "marginBottom": "30px",
            "marginTop": "30px",
            "paddingTop": "0px",
            "paddingBottom": "20px",
            "paddingLeft": "20px",
            "paddingRight": "20px",
            "borderRadius": "9px"
          },
          "parentId": "PagesGenericPage_content",
          "index": 1,
          "editor": {
            "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"FAQ\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
            "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">FAQ</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
          }
        },
      ]
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
          "jsxParentId": "PagesGenericPage_content",
          "type": "editor",
          "isVirtual": true,
          "style": {
            "minWidth": "50px",
            "minHeight": "30px",
            "backgroundColor": "#ffffff",
            "marginBottom": "30px",
            "marginTop": "30px",
            "paddingTop": "0px",
            "paddingBottom": "20px",
            "paddingLeft": "20px",
            "paddingRight": "20px",
            "borderRadius": "9px"
          },
          "parentId": "PagesGenericPage_content",
          "index": 1,
          "editor": {
            "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"Shipping and Delivery\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
            "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">Shipping and Delivery</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
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
          "jsxParentId": "PagesGenericPage_content",
          "type": "editor",
          "isVirtual": true,
          "style": {
            "minWidth": "50px",
            "minHeight": "30px",
            "backgroundColor": "#ffffff",
            "marginBottom": "30px",
            "marginTop": "30px",
            "paddingTop": "0px",
            "paddingBottom": "20px",
            "paddingLeft": "20px",
            "paddingRight": "20px",
            "borderRadius": "9px"
          },
          "parentId": "PagesGenericPage_content",
          "index": 1,
          "editor": {
            "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"Returns\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
            "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">Returns</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
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
          "jsxParentId": "PagesGenericPage_content",
          "type": "editor",
          "isVirtual": true,
          "style": {
            "minWidth": "50px",
            "minHeight": "30px",
            "backgroundColor": "#ffffff",
            "marginBottom": "30px",
            "marginTop": "30px",
            "paddingTop": "0px",
            "paddingBottom": "20px",
            "paddingLeft": "20px",
            "paddingRight": "20px",
            "borderRadius": "9px"
          },
          "parentId": "PagesGenericPage_content",
          "index": 1,
          "editor": {
            "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"Gift cards\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
            "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">Gift cards</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
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
          "jsxParentId": "PagesGenericPage_content",
          "type": "editor",
          "isVirtual": true,
          "style": {
            "minWidth": "50px",
            "minHeight": "30px",
            "backgroundColor": "#ffffff",
            "marginBottom": "30px",
            "marginTop": "30px",
            "paddingTop": "0px",
            "paddingBottom": "20px",
            "paddingLeft": "20px",
            "paddingRight": "20px",
            "borderRadius": "9px"
          },
          "parentId": "PagesGenericPage_content",
          "index": 1,
          "editor": {
            "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"News\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
            "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">News</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
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
          "jsxParentId": "PagesGenericPage_content",
          "type": "editor",
          "isVirtual": true,
          "style": {
            "minWidth": "50px",
            "minHeight": "30px",
            "backgroundColor": "#ffffff",
            "marginBottom": "30px",
            "marginTop": "30px",
            "paddingTop": "0px",
            "paddingBottom": "20px",
            "paddingLeft": "20px",
            "paddingRight": "20px",
            "borderRadius": "9px"
          },
          "parentId": "PagesGenericPage_content",
          "index": 1,
          "editor": {
            "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"Contact Information\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
            "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">Contact Information</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
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