module.exports = {
    palette: {
        "primaryColor": "#9900CC"
    },
    globalCss: [
        "react-toastify/dist/ReactToastify.css",
        '../styles/global.scss'
    ],
    headHtml: "<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;900&display=swap\" rel=\"stylesheet\" /><meta name=\"viewport\" content=\"width=device-width\"><meta property=\"og:appConfig_headHtml\" content=\"blah_blah\" key=\"blah_blah\" />",
    defaultPages: {
        index: 'index',
        post: 'post/[slug]',
        tag: 'tag/[slug]',
        pages: 'pages/[slug]',
    },
    pages: [
        {
            id: "index",
            route: "index",
            name: "Home",
            title: "Home page",
            modifications: []
        },
        {
            id: "post/[slug]",
            route: "post/[slug]",
            name: "Post",
            modifications: []
        },
        {
            id: "tag/[slug]",
            route: "tag/[slug]",
            name: "Tag",
            modifications: []
        },
        {
            id: "search",
            route: "search",
            name: "Search",
            title: "Search page",
            modifications: []
        },
        {
            id: "pages/contacts",
            route: "pages/contacts",
            name: "Contacts",
            title: "Contacts",
            isVirtual: true,
            modifications: [
                {
                    "id": "contacts_content",
                    "jsxParentId": "PagesGenericPage",
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
                    "parentId": "PagesGenericPage",
                    "index": 1,
                    "editor": {
                        "data": "{\"time\":1630764783219,\"blocks\":[{\"id\":\"R81SLM-otU\",\"type\":\"header\",\"data\":{\"text\":\"Contact Information\",\"level\":1}},{\"id\":\"8cX7U93w4F\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\"}},{\"id\":\"9cFps_xNV-\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>Lorem ipsum dolor sit amet</b>\",\"<span class=\\\"fontSize\\\" style=\\\"font-size: 16px; line-height: 26px;\\\">Lorem ipsum dolor sit amet</span>\",\"<mark class=\\\"cdx-marker\\\">Lorem ipsum dolor sit amet</mark>\"]}}],\"version\":\"2.22.2\"}",
                        "html": "<div class=\"codex-editor__redactor\" style=\"\"><div class=\"ce-block\"><div class=\"ce-block__content\"><h1 class=\"ce-header\">Contact Information</h1></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><div class=\"ce-paragraph cdx-block\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div></div></div><div class=\"ce-block\"><div class=\"ce-block__content\"><ol class=\"cdx-block cdx-list cdx-list--ordered\"><li class=\"cdx-list__item\"><b>Lorem ipsum dolor sit amet</b></li><li class=\"cdx-list__item\"><span class=\"fontSize\" style=\"font-size: 16px; line-height: 26px;\">Lorem ipsum dolor sit amet</span></li><li class=\"cdx-list__item\"><mark class=\"cdx-marker\">Lorem ipsum dolor sit amet</mark></li></ol></div></div></div>"
                    }
                },
                {
                    "id": "PagesGenericPage",
                    "type": "container",
                    "editorStyles": {
                        "maxWidth": 700,
                        "align": "center",
                        "offsetTop": 20,
                        "offsetBottom": 20
                    }
                }
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
                        "innerHTML": "<h1>Attribution</h1><div id=\"icons_attribution\" style={{ fontSize: '12px' }}>Icons made by <a href=\"http://www.freepik.com/\" title=\"Freepik\">Freepik</a> from <a href=\"https://www.flaticon.com/\" title=\"Flaticon\"> www.flaticon.com</a></div>"
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
    ],
}