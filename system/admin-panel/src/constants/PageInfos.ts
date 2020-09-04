import React from 'react';
//@ts-ignore
import { pluginNames, importPlugin } from 'CromwellImports';
import HomePage from '../pages/home';
import PluginsPage from '../pages/plugins';
import ThemeEditPage from '../pages/themeEdit/ThemeEdit';
import ThemeListPage from '../pages/themeList/ThemeList';
import ProductListPage from '../pages/productList/ProductList';
import ProductPage from '../pages/product/Product';
import {
    Dashboard as DashboardIcon,
    LocalMall as LocalMallIcon,
    Power as PowerIcon,
    FormatPaint as FormatPaintIcon
} from '@material-ui/icons';


export type SidebarLinkType = {
    title: string;
    route: string;
    baseRoute?: string;
    sublinks?: SidebarLinkType[];
    icon?: React.ReactNode;
}

export type PageInfo = {
    name: string;
    route: string;
    baseRoute?: string;
    component: React.ComponentType;
}

export const homePageInfo: PageInfo = {
    name: 'Dashboard',
    route: '/',
    component: HomePage
};
export const pluginsPageInfo: PageInfo = {
    name: 'Plugins',
    route: '/plugins',
    component: PluginsPage
};
export const themeListPageInfo: PageInfo = {
    name: 'ThemeList',
    route: '/theme-list',
    component: ThemeListPage
};
export const themeEditPageInfo: PageInfo = {
    name: 'ThemeEdit',
    route: '/theme-edit/:themeName',
    baseRoute: '/theme-edit',
    component: ThemeEditPage
};
export const productListInfo: PageInfo = {
    name: 'ProductList',
    route: '/product-list',
    component: ProductListPage
};
export const productInfo: PageInfo = {
    name: 'ProductList',
    route: '/product/:id',
    baseRoute: '/product',
    component: ProductPage
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
    themeListPageInfo,
    productListInfo,
    productListInfo,
    productInfo,
    pluginsPageInfo,
    ...pluginPages
].filter(i => Boolean(i.component));

// Export links for sidebar
export const sideBarLinks: SidebarLinkType[] = [
    {
        title: homePageInfo.name,
        route: homePageInfo.route,
        icon: React.createElement(DashboardIcon)
    },
    {
        title: 'Products',
        route: productListInfo.route,
        icon: React.createElement(LocalMallIcon)
    },
    {
        title: 'Edit theme',
        route: themeListPageInfo.route,
        icon: React.createElement(FormatPaintIcon)
    },
    {
        title: pluginsPageInfo.name,
        route: pluginsPageInfo.route,
        sublinks: pluginPages.map(p => {
            return { title: p.name, route: p.route }
        }),
        icon: React.createElement(PowerIcon)
    }
]