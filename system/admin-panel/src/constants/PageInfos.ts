import React from 'react';
import HomePage from '../pages/home';
import PluginListPage from '../pages/pluginList/PluginList';
import PluginPage from '../pages/plugin/PluginPage';
import ThemeEditPage from '../pages/themeEdit/ThemeEdit';
import ThemeListPage from '../pages/themeList/ThemeList';
import ProductListPage from '../pages/productList/ProductList';
import ProductPage from '../pages/product/Product';
import AttributesPage from '../pages/attributes/AttributesPage';
import {
    Dashboard as DashboardIcon,
    LocalMall as LocalMallIcon,
    Power as PowerIcon,
    FormatPaint as FormatPaintIcon,
    FilterList as FilterListIcon,
    Storage as StorageIcon,
    Category as CategoryIcon
} from '@material-ui/icons';


export type SidebarLinkType = {
    id: string;
    title: string;
    route?: string;
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
export const attributesInfo: PageInfo = {
    name: 'Attributes',
    route: '/product-attributes',
    component: AttributesPage
};
export const pluginListPageInfo: PageInfo = {
    name: 'PluginList',
    route: '/plugins',
    component: PluginListPage
};
export const pluginPageInfo: PageInfo = {
    name: 'Plugin',
    baseRoute: '/plugin',
    route: '/plugin',
    component: PluginPage
};

// Export all pages for react-router
export const pageInfos: PageInfo[] = [
    homePageInfo,
    themeEditPageInfo,
    themeListPageInfo,
    productListInfo,
    productListInfo,
    productInfo,
    pluginListPageInfo,
    attributesInfo,
    pluginPageInfo,
].filter(i => Boolean(i.component));

// Export links for sidebar
export const sideBarLinks: SidebarLinkType[] = [
    {
        id: '1_homePage',
        title: homePageInfo.name,
        route: homePageInfo.route,
        icon: React.createElement(DashboardIcon)
    },
    {
        id: '2_Store',
        title: 'Store',
        icon: React.createElement(LocalMallIcon),
        sublinks: [
            {
                id: '3_productList',
                title: 'Products',
                route: productListInfo.route,
                icon: React.createElement(StorageIcon)
            },
            {
                id: '4_Attributes',
                title: 'Attributes',
                route: attributesInfo.route,
                icon: React.createElement(FilterListIcon)
            },
            {
                id: '5_Categories',
                title: 'Categories',
                route: productListInfo.route,
                icon: React.createElement(CategoryIcon)
            },
        ]
    },
    {
        id: '5_themeListPage',
        title: 'Themes',
        route: themeListPageInfo.route,
        icon: React.createElement(FormatPaintIcon)
    },
    {
        id: '6_pluginsPage',
        title: 'Plugins',
        route: pluginListPageInfo.route,
        icon: React.createElement(PowerIcon)
    }
]