import React from 'react';
import { pluginNames, importPlugin } from '../../.cromwell/imports/plugins.gen';
import HomePage from '../pages/home';
import PluginsPage from '../pages/plugins';
import ThemeEditPage from '../pages/themeEdit/ThemeEdit';
import ProductListPage from '../pages/productList/ProductList';

export type SidebarLinkType = {
    title: string;
    route: string;
    sublinks?: SidebarLinkType[];
}

export type PageInfo = {
    name: string;
    route: string;
    component: React.ComponentType;
}

const homePageInfo: PageInfo = {
    name: 'Home',
    route: '/',
    component: HomePage
};
const pluginsPageInfo: PageInfo = {
    name: 'Plugins',
    route: '/plugins',
    component: PluginsPage
};
const themeEditPageInfo: PageInfo = {
    name: 'ThemeEdit',
    route: '/theme-edit',
    component: ThemeEditPage
};
const productListInfo: PageInfo = {
    name: 'ProductList',
    route: '/product-list',
    component: ProductListPage
};

const pluginPages: PageInfo[] = pluginNames.map((name: string) => {
    return {
        name,
        route: '/plugins/' + name,
        component: importPlugin(name) as React.ComponentType
    }
}).filter(i => Boolean(i.component));

// Export all pages for react-router
export const pageInfos: PageInfo[] = [
    homePageInfo,
    themeEditPageInfo,
    productListInfo,
    pluginsPageInfo,
    ...pluginPages
].filter(i => Boolean(i.component));

// Export links for sidebar
export const sideBarLinks: SidebarLinkType[] = [
    {
        title: homePageInfo.name,
        route: homePageInfo.route
    },
    {
        title: 'Products',
        route: productListInfo.route
    },
    {
        title: 'Edit theme',
        route: themeEditPageInfo.route
    },
    {
        title: pluginsPageInfo.name,
        route: pluginsPageInfo.route,
        sublinks: pluginPages.map(p => {
            return { title: p.name, route: p.route }
        })
    }
]