const fs = require('fs-extra');
const path = require('path');

async function sidebarItemsGenerator({
    defaultSidebarItemsGenerator,
    ...args
}) {
    const sidebarItems = await defaultSidebarItemsGenerator(args);

    if (!fs.pathExistsSync(path.resolve(__dirname, 'docs/api'))) return sidebarItems;

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

            item.label[0] = item.label[0].toUpperCase();

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
        if (item.label === 'api' || item.label === 'API') {
            item.label = 'Core API'
            item.items = [
                {
                    "type": "category",
                    "label": "Backend",
                    collapsible: true,
                    collapsed: true,
                    items: [
                        {
                            "type": "doc",
                            "label": "Summary",
                            "id": "api/modules/backend",
                            items: backendItems,
                            collapsible: true,
                            collapsed: true,
                        },
                        {
                            "type": "category",
                            "label": "Classes",
                            items: backendItems,
                            collapsible: true,
                            collapsed: true,
                        }
                    ],
                },
                {
                    "type": "category",
                    "label": "Common",
                    collapsible: true,
                    collapsed: true,
                    items: [
                        {
                            "type": "doc",
                            "label": "Summary",
                            "id": "api/modules/common",
                        },
                        {
                            "type": "category",
                            "label": "Classes",
                            items: commonItems,
                            collapsible: true,
                            collapsed: true,
                        }
                    ],
                },
                {
                    "type": "category",
                    "label": "Frontend",
                    collapsible: true,
                    collapsed: true,
                    items: [
                        {
                            "type": "doc",
                            "label": "Summary",
                            "id": "api/modules/frontend",
                        },
                        {
                            "type": "category",
                            "label": "Classes",
                            items: frontendItems,
                            collapsible: true,
                            collapsed: true,
                        }
                    ],
                },
            ];
        }
        return item;
    });
}

module.exports = sidebarItemsGenerator;